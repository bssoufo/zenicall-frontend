import React from "react";
import { BackendDocumentData, ReceiptData } from "../../models/DocumentModel";
import { useTranslation } from "react-i18next";

interface DocumentreceiptFormHeaderProps {
  formData: ReceiptData;
  updateFormData: (data: BackendDocumentData) => void;
}

const DocumentreceiptFormHeader: React.FC<DocumentreceiptFormHeaderProps> = ({
  formData,
  updateFormData,
}) => {
  const { t } = useTranslation("documents");

  return (
    <div className="iz_form-header iz_form-part">
      <div className="iz_fields iz_flex">
        <div className="iz_field iz_field-half">
          <label> {t("documentView.receiptFormHeaderReceiptNumber")}</label>
          <input
            type="text"
            value={formData?.receipt_number ?? ""}
            onChange={(e) =>
              updateFormData({ ...formData, receipt_number: e.target.value })
            }
          />
        </div>
        <div className="iz_field iz_field-half">
          <label>
            {t("documentView.receiptFormHeaderTransactionDate/Time")}
          </label>
          <input
            type="text"
            value={formData?.transaction_datetime ?? ""}
            onChange={(e) =>
              updateFormData({
                ...formData,
                transaction_datetime: e.target.value,
              })
            }
          />
        </div>
        <div className="iz_field iz_field-half">
          <label>{t("documentView.receiptFormHeaderStoreNumber")}</label>
          <input
            type="text"
            value={formData?.store_number ?? ""}
            onChange={(e) =>
              updateFormData({ ...formData, store_number: e.target.value })
            }
          />
        </div>
        <div className="iz_field iz_field-half">
          <label>{t("documentView.receiptFormHeaderCashierId")}</label>
          <input
            type="text"
            value={formData?.cashier_id ?? ""}
            onChange={(e) =>
              updateFormData({ ...formData, cashier_id: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentreceiptFormHeader;
