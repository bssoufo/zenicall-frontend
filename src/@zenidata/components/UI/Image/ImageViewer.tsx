import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  src: string;
}

const ImageViewer = ({ src }: Props) => {
  const { t } = useTranslation("documents");

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Zoom level
  const [zoomScale, setZoomScale] = useState(1);
  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Dragging state and pointer start position
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // Offset added via user dragging (this offset is reset when exiting fullscreen)
  const [userOffset, setUserOffset] = useState({ x: 0, y: 0 });

  // On image load or src change, calculate initial zoom and reset offset
  useEffect(() => {
    if (imageRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const imageWidth = imageRef.current.naturalWidth;
      const imageHeight = imageRef.current.naturalHeight;
      const initialZoom = Math.min(
        1.5,
        containerWidth / imageWidth,
        containerHeight / imageHeight
      );
      setZoomScale(initialZoom);
      setUserOffset({ x: 0, y: 0 });
    }
  }, [src]);

  const zoomIn = () => {
    setZoomScale((prevScale) => prevScale + 0.2);
  };

  const zoomOut = () => {
    setZoomScale((prevScale) => Math.max(1, prevScale - 0.2));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current
        ?.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err: Error) =>
          console.error("Error entering fullscreen:", err)
        );
    } else {
      document.exitFullscreen();
      // No need to reset user offset here—this will be handled by the fullscreenchange listener.
      setIsFullscreen(false);
    }
  };

  // When fullscreen status changes, update state. When exiting fullscreen, reset the drag offset.
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      if (!isNowFullscreen) {
        // Reset the user offset so the image re-centers
        setUserOffset({ x: 0, y: 0 });
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handle pointer events for dragging/panning the image
  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const offsetX = e.clientX - dragStart.x;
    const offsetY = e.clientY - dragStart.y;
    setUserOffset((prevOffset) => ({
      x: prevOffset.x + offsetX,
      y: prevOffset.y + offsetY,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const endDrag = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Reset zoom and offset. If in fullscreen, exit fullscreen.
  const resetView = () => {
    if (imageRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const imageWidth = imageRef.current.naturalWidth;
      const imageHeight = imageRef.current.naturalHeight;
      const initialZoom = Math.min(
        1.5,
        containerWidth / imageWidth,
        containerHeight / imageHeight
      );
      setZoomScale(initialZoom);
    } else {
      setZoomScale(1);
    }
    setUserOffset({ x: 0, y: 0 });
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle wheel events for zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  // Calculate the base offset to center the image in the container
  const getCenteredOffset = () => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const containerHeight = containerRef.current?.clientHeight ?? 0;
    const imageWidth = imageRef.current?.naturalWidth ?? 0;
    const imageHeight = imageRef.current?.naturalHeight ?? 0;
    const scaledWidth = imageWidth * zoomScale;
    const scaledHeight = imageHeight * zoomScale;
    return {
      x: (containerWidth - scaledWidth) / 2,
      y: (containerHeight - scaledHeight) / 2,
    };
  };

  // Combine the centered offset with any user dragging offset
  const getImageStyle = () => {
    const centeredOffset = getCenteredOffset();
    const finalX = centeredOffset.x + userOffset.x;
    const finalY = centeredOffset.y + userOffset.y;
    return {
      transform: `translate(${finalX}px, ${finalY}px) scale(${zoomScale})`,
      cursor: isDragging ? "grabbing" : "grab",
      transition: isDragging ? "none" : "transform 0.1s ease-out",
    };
  };

  return (
    <div
      className="image-viewer"
      ref={containerRef}
      onWheel={handleWheel}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}>
      <img
        ref={imageRef}
        src={src}
        alt="Viewable"
        style={getImageStyle()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
      <div className="image-controls">
        <button type="button" onClick={zoomIn}>
          {t("fileEditor.imageViewZoomIn")}
        </button>
        <button type="button" onClick={zoomOut}>
          {t("fileEditor.imageViewZoomOut")}
        </button>
        <button type="button" onClick={toggleFullscreen}>
          {isFullscreen
            ? t("fileEditor.exitFullScreen")
            : t("fileEditor.fullscreen")}
        </button>
        <button type="button" onClick={resetView}>
          {t("fileEditor.imageViewReset")}
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
