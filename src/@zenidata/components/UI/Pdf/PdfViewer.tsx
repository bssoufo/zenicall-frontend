// src/@zenidata/components/UI/Pdf/PdfViewer.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { throttle } from "lodash";
import "./PdfViewer.css";
import { useTranslation } from "react-i18next";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

interface Props {
  source: Object | string | File;
  pdfOptions?: Object;
}

const PdfViewer = ({ source, pdfOptions = {} }: Props) => {
  const { t } = useTranslation("documents");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [zoomScale, setZoomScale] = useState(1);
  const [targetZoomScale, setTargetZoomScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const renderController = useRef<AbortController | null>(null);
  const isMounted = useRef(false);

  // Drag functionality refs
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Drag event handlers
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      startDragging(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startDragging(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        e.preventDefault();
        const deltaX = e.clientX - startX.current;
        const deltaY = e.clientY - startY.current;
        container.scrollLeft = scrollLeft.current - deltaX;
        container.scrollTop = scrollTop.current - deltaY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches.length === 1) {
        e.preventDefault();
        const deltaX = e.touches[0].clientX - startX.current;
        const deltaY = e.touches[0].clientY - startY.current;
        container.scrollLeft = scrollLeft.current - deltaX;
        container.scrollTop = scrollTop.current - deltaY;
      }
    };

    const handleMouseUp = () => stopDragging();
    const handleTouchEnd = () => stopDragging();

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const startDragging = (clientX: number, clientY: number) => {
    if (!canvasContainerRef.current) return;
    isDragging.current = true;
    startX.current = clientX;
    startY.current = clientY;
    scrollLeft.current = canvasContainerRef.current.scrollLeft;
    scrollTop.current = canvasContainerRef.current.scrollTop;
    canvasContainerRef.current.style.cursor = "grabbing";
  };

  const stopDragging = () => {
    isDragging.current = false;
    if (canvasContainerRef.current) {
      canvasContainerRef.current.style.cursor = "grab";
    }
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      renderController.current?.abort();
    };
  }, []);

  const loadPdf = useCallback(
    async (pdfSource: Object | string | File) => {
      if (!pdfSource) return;
      setLoading(true);
      setError("");

      try {
        renderController.current?.abort();
        let loadingTask;
        if (typeof pdfSource === "string") {
          if (pdfSource.startsWith("http")) {
            loadingTask = pdfjsLib.getDocument({
              url: pdfSource,
              ...pdfOptions,
            });
          } else if (pdfSource.startsWith("data:application/pdf")) {
            const byteArray = Uint8Array.from(
              atob(pdfSource.split(",")[1]),
              (c) => c.charCodeAt(0)
            );
            loadingTask = pdfjsLib.getDocument({
              data: byteArray,
              ...pdfOptions,
            });
          }
        } else if (pdfSource instanceof File) {
          const arrayBuffer = await pdfSource.arrayBuffer();
          loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(arrayBuffer),
            ...pdfOptions,
          });
        }

        if (loadingTask) {
          const pdfDocument = await loadingTask.promise;
          if (isMounted.current) {
            setPdf(pdfDocument);
            setNumPages(pdfDocument.numPages);
          }
        }
      } catch (err) {
        if (isMounted.current && !(err instanceof DOMException)) {
          console.error("Error loading PDF:", err);
          setError("Error loading PDF. Please check the source.");
        }
      } finally {
        if (isMounted.current) setLoading(false);
      }
    },
    [pdfOptions]
  );

  const renderPage = useCallback(async () => {
    if (!pdf || !canvasRef.current) return;

    try {
      renderController.current?.abort();
      const controller = new AbortController();
      renderController.current = controller;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not get canvas context");

      const page = await pdf.getPage(pageNumber);
      if (controller.signal.aborted) return;

      const rotation = page.rotate;
      const scale = targetZoomScale * window.devicePixelRatio;
      const viewport = page.getViewport({ scale, rotation });

      canvas.height = Math.round(viewport.height);
      canvas.width = Math.round(viewport.width);

      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      
      const renderTask = page.render({
        canvasContext: context,
        viewport,
      });

      await renderTask.promise;
      context.restore();
      
      if (isMounted.current) {
        setZoomScale(targetZoomScale);
      }
    } catch (err) {
      if (
        isMounted.current &&
        !(err instanceof Error && err.message !== "Rendering cancelled")
      ) {
        console.error("Error rendering page:", err);
        setError("Error rendering the PDF page.");
      }
    }
  }, [pdf, pageNumber, targetZoomScale]);

  const handleZoom = useCallback((newScale: number) => {
    const clampedScale = Math.max(0.5, Math.min(newScale, 3));
    setTargetZoomScale(clampedScale);
  }, []);

  const throttledRender = useCallback(throttle(renderPage, 100), [renderPage]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        let newScale = zoomScale + (e.deltaY > 0 ? -0.1 : 0.1);
        newScale = Math.max(0.5, Math.min(newScale, 3));
        handleZoom(newScale);
      }
    },
    [zoomScale, handleZoom]
  );

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(console.error);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(throttledRender);
    observer.observe(container);

    return () => observer.disconnect();
  }, [throttledRender]);

  useEffect(() => {
    loadPdf(source);
  }, [source, loadPdf]);

  useEffect(() => {
    throttledRender();
  }, [targetZoomScale, pageNumber, throttledRender]);

  return (
    <div ref={containerRef} className="pdf-viewer" onWheel={handleWheel}>
      {loading && (
        <div className="pdf-loading">{t("fileEditor.loadingPdf")}...</div>
      )}

      <div
        className="canvas-container"
        ref={canvasContainerRef}
        style={{
          cursor: "grab",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
          width: "100%",
          height: "100%",
        }}>
        <canvas
          ref={canvasRef}
          className="pdf-canvas"
          style={{ visibility: loading ? "hidden" : "visible" }}
        />
      </div>

      {!loading && numPages > 0 && (
        <div className="pdf-controls">
          <button
            type="button"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}>
            {t("fileEditor.preview")}
          </button>
          <span>
            {pageNumber} / {numPages}
          </span>
          <button
            type="button"
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}>
            {t("fileEditor.next")}
          </button>

          <div className="zoom-controls">
            <button type="button" onClick={() => handleZoom(zoomScale - 0.1)}>
              −
            </button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoomScale}
              onChange={(e) => handleZoom(parseFloat(e.target.value))}
            />
            <button type="button" onClick={() => handleZoom(zoomScale + 0.1)}>
              +
            </button>
          </div>

          <button type="button" onClick={toggleFullscreen}>
            {isFullscreen ? t("fileEditor.exitFullscreen") : t("fileEditor.fullscreen")}
          </button>
        </div>
      )}

      {error && <div className="pdf-error">{error}</div>}
    </div>
  );
};

export default PdfViewer;
