import React from "react";
import {
  BackendDocumentData,
  Customer,
  Address,
} from "../../models/DocumentModel";
import { useTranslation } from "react-i18next";

interface CustomerSectionProps {
  formData: BackendDocumentData;
  customerOpen: boolean;
  setCustomerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCustomerChange: <K extends keyof Customer>(
    key: K,
    value: Customer[K]
  ) => void;
  handleAddressChange: <K extends keyof Address>(
    parentKey: "merchant" | "customer",
    key: K,
    value: Address[K]
  ) => void;
}

const CustomerSection: React.FC<CustomerSectionProps> = ({
  formData,
  customerOpen,
  setCustomerOpen,
  handleCustomerChange,
  handleAddressChange,
}) => {
  const { t } = useTranslation("documents");

  return (
    <div
      className={`iz_taxes-discounts iz_toggle-block ${
        customerOpen ? "iz_is-open" : ""
      }`}>
      <h3
        className={`iz_toggle-title ${customerOpen ? "iz_is-open" : ""}`}
        onClick={() => setCustomerOpen(!customerOpen)}>
        {t("documentView.customer")}
      </h3>
      <div className={`iz_content-fields ${customerOpen ? "iz_is-open" : ""}`}>
        <div className="iz_field">
          <label>{t("documentView.customerName")}</label>
          <input
            type="text"
            value={formData.customer?.name ?? ""}
            onChange={(e) => handleCustomerChange("name", e.target.value)}
          />
        </div>

        {/* Address */}
        <div className="iz_group-fields">
          <h4>{t("documentView.customerAdress")}</h4>
          <div className="iz_field">
            <label>{t("documentView.customerStreet")}</label>
            <input
              type="text"
              value={formData.customer?.address?.street ?? ""}
              onChange={(e) =>
                handleAddressChange("customer", "street", e.target.value)
              }
            />
          </div>
          <div className="iz_fields iz_flex">
            <div className="iz_field iz_field-half">
              <label>{t("documentView.customerCity")}</label>
              <input
                type="text"
                value={formData.customer?.address?.city ?? ""}
                onChange={(e) =>
                  handleAddressChange("customer", "city", e.target.value)
                }
              />
            </div>
            <div className="iz_field iz_field-half">
              <label>{t("documentView.customerState")}</label>
              <input
                type="text"
                value={formData.customer?.address?.state ?? ""}
                onChange={(e) =>
                  handleAddressChange("customer", "state", e.target.value)
                }
              />
            </div>
            <div className="iz_field iz_field-half">
              <label>{t("documentView.customerPostalCode")}</label>
              <input
                type="text"
                value={formData.customer?.address?.postal_code ?? ""}
                onChange={(e) =>
                  handleAddressChange("customer", "postal_code", e.target.value)
                }
              />
            </div>
            <div className="iz_field iz_field-half">
              <label>{t("documentView.customerCountry")}</label>
              <input
                type="text"
                value={formData.customer?.address?.country ?? ""}
                onChange={(e) =>
                  handleAddressChange("customer", "country", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="iz_group-fields">
          <h4>{t("documentView.customerContact")}</h4>
          <div className="iz_fields iz_flex">
            <div className="iz_field iz_field-half">
              <label>{t("documentView.customerEmail")}</label>
              <input
                type="text"
                value={formData.customer?.email ?? ""}
                onChange={(e) => handleCustomerChange("email", e.target.value)}
              />
            </div>
            <div className="iz_field iz_field-half">
              <label>{t("documentView.customerPhone")}</label>
              <input
                type="text"
                value={formData.customer?.phone ?? ""}
                onChange={(e) => handleCustomerChange("phone", e.target.value)}
              />
            </div>
            <div className="iz_field iz_field-half">
              <label>{t("documentView.customerWebsite")}</label>
              <input
                type="text"
                value={formData.customer?.website ?? ""}
                onChange={(e) =>
                  handleCustomerChange("website", e.target.value)
                }
              />
            </div>
            <div className="iz_field iz_field-half">
              <label>{t("documentView.customerFax")}</label>
              <input
                type="text"
                value={formData.customer?.fax ?? ""}
                onChange={(e) => handleCustomerChange("fax", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tax IDs */}
        <div className="iz_group-fields">
          <h4>{t("documentView.customerFax")}</h4>
          <div className="iz_fields iz_flex">
            <div className="iz_field iz_field-third">
              <label>{t("documentView.customerVAT")}</label>
              <input
                type="text"
                value={formData.customer?.vat_number ?? ""}
                onChange={(e) =>
                  handleCustomerChange("vat_number", e.target.value)
                }
              />
            </div>
            <div className="iz_field iz_field-third">
              <label>{t("documentView.customerGST")}</label>
              <input
                type="text"
                value={formData.customer?.GST_number ?? ""}
                onChange={(e) =>
                  handleCustomerChange("GST_number", e.target.value)
                }
              />
            </div>
            <div className="iz_field iz_field-third">
              <label>{t("documentView.customerQST")}</label>
              <input
                type="text"
                value={formData.customer?.QST_number ?? ""}
                onChange={(e) =>
                  handleCustomerChange("QST_number", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSection;
