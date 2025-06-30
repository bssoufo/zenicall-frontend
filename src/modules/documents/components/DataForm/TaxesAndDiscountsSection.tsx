import React, { useState } from "react";
import { BackendDocumentData, Tax, Discount } from "../../models/DocumentModel";
import ConfirmationDialog from "../../../../@zenidata/components/ConfirmationDialog";
import { useTranslation } from "react-i18next";

interface TaxesAndDiscountsSectionProps {
  formData: BackendDocumentData;
  taxesAndDiscountsOpen: boolean;
  setTaxesAndDiscountsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mappedTaxes: Tax[];
  mappedDiscounts: Discount[];
  handleTaxDiscountChange: (
    section: "tax_lines" | "discount_lines",
    index: number,
    field: string,
    value: any
  ) => void;
  handleAddTax: () => void;
  handleRemoveTax: (index: number) => void;
  handleAddDiscount: () => void;
  handleRemoveDiscount: (index: number) => void;
}

const TaxesAndDiscountsSection: React.FC<TaxesAndDiscountsSectionProps> = ({
  formData,
  taxesAndDiscountsOpen,
  setTaxesAndDiscountsOpen,
  mappedTaxes,
  mappedDiscounts,
  handleTaxDiscountChange,
  handleAddTax,
  handleRemoveTax,
  handleAddDiscount,
  handleRemoveDiscount,
}) => {
  const { t } = useTranslation("documents");

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    index: number;
    type: "tax" | "discount";
  } | null>(null);

  const handleDeleteClick = (index: number, type: "tax" | "discount") => {
    setItemToDelete({ index, type });
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === "tax") {
        handleRemoveTax(itemToDelete.index);
      } else {
        handleRemoveDiscount(itemToDelete.index);
      }
      setItemToDelete(null);
    }
    setShowConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
    setShowConfirmDialog(false);
  };

  return (
    <div
      className={`iz_taxes-discounts iz_toggle-block ${
        taxesAndDiscountsOpen ? "iz_is-open" : ""
      }`}>
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this ${
          itemToDelete?.type === "tax" ? "tax" : "discount"
        }? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <h3
        className={`iz_toggle-title ${
          taxesAndDiscountsOpen ? "iz_is-open" : ""
        }`}
        onClick={() => setTaxesAndDiscountsOpen(!taxesAndDiscountsOpen)}>
        {t("documentView.taxesDiscounts")}
      </h3>
      <div
        className={`iz_content-fields ${
          taxesAndDiscountsOpen ? "iz_is-open" : ""
        }`}>
        <div className="iz_group-fields">
          <h4>
            {t("documentView.taxesDiscountsTaxes")} (
            {formData.tax_lines?.length ?? 0})
          </h4>
          <div className="iz_table-container">
            {mappedTaxes.map((tax, index) => (
              <table key={index}>
                <tbody>
                  <tr>
                    <th>
                      <div className="iz_field iz_flex">
                        <label>{t("documentView.taxesDiscountsName")}</label>
                        <input
                          type="text"
                          value={tax.name}
                          onChange={(e) =>
                            handleTaxDiscountChange(
                              "tax_lines",
                              index,
                              "tax_name",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </th>
                    <td>
                      <div className="iz_field">
                        <input
                          type="text"
                          value={tax.rate}
                          onChange={(e) =>
                            handleTaxDiscountChange(
                              "tax_lines",
                              index,
                              "tax_rate",
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="iz_field">
                        <input
                          type="text"
                          value={tax.amount}
                          onChange={(e) =>
                            handleTaxDiscountChange(
                              "tax_lines",
                              index,
                              "tax_amount",
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <a
                        onClick={() => handleDeleteClick(index, "tax")}
                        className="iz_file-delete-upload iz_text-error"
                        title="Remove upload"></a>
                      {/* <button
                        type="button"
                        className="iz_btn iz_btn-danger"
                        >
                        Remove
                      </button> */}
                    </td>
                  </tr>
                </tbody>
              </table>
            ))}

            <div className="iz_more-line">
              <button type="button" onClick={handleAddTax}>
                {t("documentView.taxesDiscountsAddTaxe")}
              </button>
            </div>
          </div>
        </div>

        <div className="iz_group-fields">
          <h4>
            {t("documentView.taxesDiscountsDiscountPromotions")} (
            {formData.discount_lines?.length ?? 0})
          </h4>
          <div className="iz_table-container">
            {mappedDiscounts.map((discount, index) => (
              <table key={index}>
                <tbody>
                  <tr>
                    <th>{t("documentView.taxesDiscountsName")}</th>
                    <td>
                      <div className="iz_field">
                        <input
                          type="text"
                          value={discount.name}
                          onChange={(e) =>
                            handleTaxDiscountChange(
                              "discount_lines",
                              index,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="iz_field">
                        <input
                          type="text"
                          value={discount.amount}
                          onChange={(e) =>
                            handleTaxDiscountChange(
                              "discount_lines",
                              index,
                              "amount",
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <a
                        onClick={() => handleDeleteClick(index, "discount")}
                        className="iz_file-delete-upload iz_text-error"
                        title="Remove upload"></a>
                      {/* <button
                        type="button"
                        className="iz_btn iz_btn-danger"
                       >
                        Remove
                      </button> */}
                    </td>
                  </tr>
                </tbody>
              </table>
            ))}

            <div className="iz_more-line">
              <button type="button" onClick={handleAddDiscount}>
                {t("documentView.taxesDiscountsAddDiscount")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxesAndDiscountsSection;
