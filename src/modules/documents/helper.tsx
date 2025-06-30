import { DocumentStatus } from "./models/DocumentModel";

export const displayDocumentStatus = (
  status: DocumentStatus,
  text: string = ""
) => {
  let classes = "";
  switch (status) {
    case "processed":
      classes = "iz_text-success";
      break;
    case "pending":
      classes = "iz_text-warning";
      break;
    case "failed":
      classes = "iz_text-error";
      break;
  }
  return <span className={classes}>{text !== "" ? text : status}</span>;
};

export const displayDocumentType = (
  documentType: string,
  text: string = ""
) => {
  let classes = "";
  switch (documentType) {
    case "INVOICE":
      classes = "iz_text-warning";
      break;
    case "RECEIPT":
      classes = "iz_text-warning";
      break;
  }
  return <span className={classes}>{text !== "" ? text : documentType}</span>;
};
