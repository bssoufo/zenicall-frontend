import React from "react";
import {
  InvoiceData,
  BackendDocumentData,
} from "../../../../models/DocumentModel";
import { useTranslation } from "react-i18next";

interface InvoiceFormHeaderHeaderProps {
  formData: InvoiceData;
  updateFormData: (data: BackendDocumentData) => void;
}

const InvoiceFormHeader: React.FC<InvoiceFormHeaderHeaderProps> = ({
  formData,
  updateFormData,
}) => {
  const { t } = useTranslation("documents");

  return (
    <div className="iz_form-header iz_form-part">
      <div className="iz_fields iz_flex">
        {/* Invoice Number */}
        <div className="iz_field iz_field-half">
          <label>{t("documentView.invoiceFormHeaderInvoiceNumber")}</label>
          <input
            type="text"
            value={formData?.invoice_number ?? ""}
            onChange={(e) =>
              updateFormData({ ...formData, invoice_number: e.target.value })
            }
          />
        </div>

        {/* Invoice Date */}
        <div className="iz_field iz_field-half">
          <label>{t("documentView.invoiceFormHeaderInvoiceDate")}</label>
          <input
            type="text"
            value={formData?.invoice_date ?? ""}
            onChange={(e) =>
              updateFormData({ ...formData, invoice_date: e.target.value })
            }
          />
        </div>

        {/* Invoice Due Date */}
        <div className="iz_field iz_field-half">
          <label>{t("documentView.invoiceFormHeaderDueDate")}</label>
          <input
            type="text"
            value={formData?.invoice_due_date ?? ""}
            onChange={(e) =>
              updateFormData({ ...formData, invoice_due_date: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceFormHeader;
