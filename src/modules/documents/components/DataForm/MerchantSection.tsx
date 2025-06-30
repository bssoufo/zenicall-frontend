import React from "react";
import {
  BackendDocumentData,
  ReceiptData,
  Merchant,
  Address,
} from "../../models/DocumentModel";
import { useTranslation } from "react-i18next";

interface MerchantSectionProps {
  formData: ReceiptData;
  merchantOpen: boolean;
  setMerchantOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleMerchantChange: <K extends keyof Merchant>(
    key: K,
    value: Merchant[K]
  ) => void;
  handleAddressChange: <K extends keyof Address>(
    parentKey: "merchant" | "customer",
    key: K,
    value: Address[K]
  ) => void;
}

const MerchantSection: React.FC<MerchantSectionProps> = ({
  formData,
  merchantOpen,
  setMerchantOpen,
  handleMerchantChange,
  handleAddressChange,
}) => {
  const { t } = useTranslation("documents");

  return (
    <div
      className={`iz_merchant iz_toggle-block ${
        merchantOpen ? "iz_is-open" : ""
      }`}>
      {/* Corrected className here - changed setMerchantOpen to merchantOpen */}
      <h3
        className={`iz_toggle-title ${merchantOpen ? "iz_is-open" : ""}`}
        onClick={() => setMerchantOpen(!merchantOpen)}>
        {t("documentView.receiptFormMerchant")}
      </h3>
      <div className={`iz_content-fields ${merchantOpen ? "iz_is-open" : ""}`}>
        <div className="iz_field">
          <label> {t("documentView.receiptFormMerchantName")}</label>
          <input
            type="text"
            value={formData.merchant?.name ?? ""}
            onChange={(e) => handleMerchantChange("name", e.target.value)}
          />
        </div>

        {/* Address */}
        <div className="iz_group-fields">
          <h4> {t("documentView.receiptFormMerchantAdress")}</h4>
          <div className="iz_field">
            <label> {t("documentView.receiptFormMerchantStreet")}</label>
            <input
              type="text"
              value={formData.merchant?.address?.street ?? ""}
              onChange={(e) =>
                handleAddressChange("merchant", "street", e.target.value)
              }
            />
          </div>
          <div className="iz_fields iz_flex">
            <div className="iz_field iz_field-half">
              <label> {t("documentView.receiptFormMerchantCity")}</label>
              <input
                type="text"
                value={formData.merchant?.address?.city ?? ""}
                onChange={(e) =>
                  handleAddressChange("merchant", "city", e.target.value)
                }
              />
            </div>
            <div className="iz_field iz_field-half">
              <label> {t("documentView.receiptFormMerchantState")}</label>
              <input
                type="text"
                value={formData.merchant?.address?.state ?? ""}
                onChange={(e) =>
                  handleAddressChange("merchant", "state", e.target.value)
                }
              />
            </div>
            <div className="iz_field iz_field-half">
              <label> {t("documentView.receiptFormMerchantPostalCode")}</label>
              <input
                type="text"
                value={formData.merchant?.address?.postal_code ?? ""}
                onChange={(e) =>
                  handleAddressChange("merchant", "postal_code", e.target.value)
                }
              />
            </div>
            <div className="iz_field iz_field-half">
              <label> {t("documentView.receiptFormMerchantCountry")}</label>
              <input
                type="text"
                value={formData.merchant?.address?.country ?? ""}
                onChange={(e) =>
                  handleAddressChange("merchant", "country", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="iz_group-fields">
          <h4> {t("documentView.receiptFormMerchantContact")}</h4>
          <div className="iz_fields iz_flex">
            <div className="iz_field iz_field-half">
              <label> {t("documentView.receiptFormMerchantEmail")}</label>
              <input
                type="text"
                value={formData.merchant?.email ?? ""}
                onChange={(e) => handleMerchantChange("email", e.target.value)}
              />
            </div>
            <div className="iz_field iz_field-half">
              <label> {t("documentView.receiptFormMerchantPhone")}</label>
              <input
                type="text"
                value={formData.merchant?.phone ?? ""}
                onChange={(e) => handleMerchantChange("phone", e.target.value)}
              />
            </div>
            <div className="iz_field iz_field-half">
              <label> {t("documentView.receiptFormMerchantWebsite")}</label>
              <input
                type="text"
                value={formData.merchant?.website ?? ""}
                onChange={(e) =>
                  handleMerchantChange("website", e.target.value)
                }
              />
            </div>
            <div className="iz_field iz_field-half">
              <label> {t("documentView.receiptFormMerchantFax")}</label>
              <input
                type="text"
                value={formData.merchant?.fax ?? ""}
                onChange={(e) => handleMerchantChange("fax", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tax IDs */}
        <div className="iz_group-fields">
          <h4> {t("documentView.receiptFormTaxId")}</h4>
          <div className="iz_fields iz_flex">
            <div className="iz_field iz_field-third">
              <label> {t("documentView.reciiptFormVAT")}</label>
              <input
                type="text"
                value={formData.merchant?.vat_number ?? ""}
                onChange={(e) =>
                  handleMerchantChange("vat_number", e.target.value)
                }
              />
            </div>
            <div className="iz_field iz_field-third">
              <label> {t("documentView.reciiptFormGST")}</label>
              <input
                type="text"
                value={formData.merchant?.GST_number ?? ""}
                onChange={(e) =>
                  handleMerchantChange("GST_number", e.target.value)
                }
              />
            </div>
            <div className="iz_field iz_field-third">
              <label> {t("documentView.reciiptFormQST")}</label>
              <input
                type="text"
                value={formData.merchant?.QST_number ?? ""}
                onChange={(e) =>
                  handleMerchantChange("QST_number", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantSection;
