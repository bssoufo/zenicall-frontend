import React from "react";
import {
  BackendDocument,
  DocumentDataFormProps,
} from "../../models/DocumentModel";
import { useTranslation } from "react-i18next";

const InvoiceDataForm = React.lazy(() => import("./Invoice/InvoiceDataForm"));
const ReceiptDataForm = React.lazy(() => import("./Receipt/ReceiptDataForm"));

interface DocumentFormFactoryProps {
  document: BackendDocument;
}

const DocumentFormFactory: React.FC<DocumentDataFormProps> = ({
  documentData,
  documentId,
  documentType,
  onDataChange,
}) => {
  const { t } = useTranslation("documents");

  switch (documentType) {
    case "RECEIPT":
      return (
        <ReceiptDataForm
          documentData={documentData}
          documentId={documentId}
          documentType={documentType}
          onDataChange={onDataChange}
        />
      );
    case "INVOICE":
      return (
        <InvoiceDataForm
          documentData={documentData}
          documentId={documentId}
          documentType={documentType}
          onDataChange={onDataChange}
        />
      );
    // Add new document types here
    default:
      return (
        <div>{t("fileEditor.documentFormFactoryUnsupportedDocument")}</div>
      );
  }
};

export default DocumentFormFactory;
