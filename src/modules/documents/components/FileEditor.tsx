// src/components/Documents/DocumentImage.tsx
import React, { memo } from "react";

import ImageViewer from "../../../@zenidata/components/UI/Image/ImageViewer";
import PdfViewer from "../../../@zenidata/components/UI/Pdf/PdfViewer";
import { useTranslation } from "react-i18next";

interface FileEditorProps {
  fichier: string | null;
  API_BASE_URL?: string;
}

const FileEditor: React.FC<FileEditorProps> = memo(({ fichier }) => {
  const { t } = useTranslation("documents");

  if (!fichier) {
    return (
      <div className="document-image-container">
        <p>{t("fileEditor.noImageForDocument")}</p>
      </div>
    );
  }

  // Extract filename from URL before the "?" character
  const filename = fichier.split("?")[0];
  const isPdf = filename.toLowerCase().endsWith(".pdf");
  const isImage =
    !isPdf &&
    (filename.toLowerCase().endsWith(".png") ||
      filename.toLowerCase().endsWith(".jpg") ||
      filename.toLowerCase().endsWith(".jpeg") ||
      filename.toLowerCase().endsWith(".gif"));

  if (isPdf) {
    return (
      <PdfViewer
        source={fichier}
        pdfOptions={{ cMapUrl: "cmaps/", cMapPacked: true }}
      />
    );
  }

  if (isImage) {
    return <ImageViewer src={`${fichier}`} />;
  }

  return (
    <div className="document-image-container">
      <p>{t("fileEditor.fileFormatNotSupported")}.</p>
    </div>
  );
});

export default FileEditor;
