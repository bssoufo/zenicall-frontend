import React from "react";
import {
  BackendDocumentData,
  Seller,
  Address,
  InvoiceData,
} from "../../../../models/DocumentModel";
import { useTranslation } from "react-i18next";

interface SellerSectionProps {
  formData: BackendDocumentData;
  sellerOpen: boolean;
  setSellerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSellerChange: <K extends keyof Seller>(
    key: K,
    value: Seller[K]
  ) => void;
  handleAddressChange: <K extends keyof Address>(
    parentKey: "merchant" | "customer" | "seller",
    key: K,
    value: Address[K]
  ) => void;
}

const SellerSection: React.FC<SellerSectionProps> = ({
  formData,
  sellerOpen,
  setSellerOpen,
  handleSellerChange,
  handleAddressChange,
}) => {
  const { t } = useTranslation("documents");

  return (
    <div
      className={`iz_taxes-discounts iz_toggle-block ${
        sellerOpen ? "iz_is-open" : ""
      }`}>
      <h3
        className={`iz_toggle-title ${sellerOpen ? "iz_is-open" : ""}`}
        onClick={() => setSellerOpen(!sellerOpen)}>
        {t("documentView.invoiceFormSeller")}Seller
      </h3>
      <div className={`iz_content-fields ${sellerOpen ? "iz_is-open" : ""}`}>
        <div>
          <div className="iz_field">
            <label> {t("documentView.invoiceFormSellerName")}</label>
            <input
              type="text"
              value={(formData as InvoiceData).seller?.name ?? ""}
              onChange={(e) => handleSellerChange("name", e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="iz_group-fields">
            <h4> {t("documentView.invoiceFormSellerAddress")}</h4>
            <div className="iz_field">
              <label> {t("documentView.invoiceFormSellerStreet")}</label>
              <input
                type="text"
                value={(formData as InvoiceData).seller?.address?.street ?? ""}
                onChange={(e) =>
                  handleAddressChange("seller", "street", e.target.value)
                }
              />
            </div>
            <div className="iz_fields iz_flex">
              <div className="iz_field iz_field-half">
                <label> {t("documentView.invoiceFormSellerCity")}</label>
                <input
                  type="text"
                  value={(formData as InvoiceData).seller?.address?.city ?? ""}
                  onChange={(e) =>
                    handleAddressChange("seller", "city", e.target.value)
                  }
                />
              </div>
              <div className="iz_field iz_field-half">
                <label> {t("documentView.invoiceFormSellerState")}</label>
                <input
                  type="text"
                  value={(formData as InvoiceData).seller?.address?.state ?? ""}
                  onChange={(e) =>
                    handleAddressChange("seller", "state", e.target.value)
                  }
                />
              </div>
              <div className="iz_field iz_field-half">
                <label> {t("documentView.invoiceFormSellerPostalCode")}</label>
                <input
                  type="text"
                  value={
                    (formData as InvoiceData).seller?.address?.postal_code ?? ""
                  }
                  onChange={(e) =>
                    handleAddressChange("seller", "postal_code", e.target.value)
                  }
                />
              </div>
              <div className="iz_field iz_field-half">
                <label> {t("documentView.invoiceFormSellerCountry")}</label>
                <input
                  type="text"
                  value={
                    (formData as InvoiceData).seller?.address?.country ?? ""
                  }
                  onChange={(e) =>
                    handleAddressChange("seller", "country", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="iz_group-fields">
            <h4> {t("documentView.invoiceFormSellerContact")}</h4>
            <div className="iz_fields iz_flex">
              <div className="iz_field iz_field-half">
                <label> {t("documentView.invoiceFormSellerEmail")}</label>
                <input
                  type="text"
                  value={(formData as InvoiceData).seller?.email ?? ""}
                  onChange={(e) => handleSellerChange("email", e.target.value)}
                />
              </div>
              <div className="iz_field iz_field-half">
                <label> {t("documentView.invoiceFormSellerPhone")}</label>
                <input
                  type="text"
                  value={(formData as InvoiceData).seller?.phone ?? ""}
                  onChange={(e) => handleSellerChange("phone", e.target.value)}
                />
              </div>
              <div className="iz_field iz_field-half">
                <label> {t("documentView.invoiceFormSellerWebsite")}</label>
                <input
                  type="text"
                  value={(formData as InvoiceData).seller?.website ?? ""}
                  onChange={(e) =>
                    handleSellerChange("website", e.target.value)
                  }
                />
              </div>
              <div className="iz_field iz_field-half">
                <label> {t("documentView.invoiceFormSellerFax")}</label>
                <input
                  type="text"
                  value={(formData as InvoiceData).seller?.fax ?? ""}
                  onChange={(e) => handleSellerChange("fax", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tax IDs */}
          <div className="iz_group-fields">
            <h4> {t("documentView.invoiceFormSellerTaxIDs")}</h4>
            <div className="iz_fields iz_flex">
              <div className="iz_field iz_field-third">
                <label> {t("documentView.invoiceFormSellerVAT")}</label>
                <input
                  type="text"
                  value={(formData as InvoiceData).seller?.vat_number ?? ""}
                  onChange={(e) =>
                    handleSellerChange("vat_number", e.target.value)
                  }
                />
              </div>
              <div className="iz_field iz_field-third">
                <label> {t("documentView.invoiceFormSellerGST")}</label>
                <input
                  type="text"
                  value={(formData as InvoiceData).seller?.GST_number ?? ""}
                  onChange={(e) =>
                    handleSellerChange("GST_number", e.target.value)
                  }
                />
              </div>
              <div className="iz_field iz_field-third">
                <label> {t("documentView.invoiceFormSellerQST")}</label>
                <input
                  type="text"
                  value={(formData as InvoiceData).seller?.QST_number ?? ""}
                  onChange={(e) =>
                    handleSellerChange("QST_number", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSection;
