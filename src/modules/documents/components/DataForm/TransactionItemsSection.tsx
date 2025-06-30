import React, { useState } from "react";
import {
  BackendDocumentData,
  TransactionItem,
} from "../../models/DocumentModel";
import ConfirmationDialog from "../../../../@zenidata/components/ConfirmationDialog";
import { useTranslation } from "react-i18next";

interface TransactionItemsSectionProps {
  formData: BackendDocumentData;
  transactionItemsOpen: boolean;
  setTransactionItemsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mappedTransactionItems: TransactionItem[];
  handleTransactionItemChange: (index: number, field: any, value: any) => void;
  handleAddItem: () => void;
  handleRemoveItem: (index: number) => void;
}

const TransactionItemsSection: React.FC<TransactionItemsSectionProps> = ({
  formData,
  transactionItemsOpen,
  setTransactionItemsOpen,
  mappedTransactionItems,
  handleTransactionItemChange,
  handleAddItem,
  handleRemoveItem,
}) => {
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("documents");

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleDeleteClick = (index: number) => {
    setItemToDelete(index);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete !== null) {
      handleRemoveItem(itemToDelete);
      setItemToDelete(null);
    }
    setShowConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
    setShowConfirmDialog(false);
  };

  return (
    <div className="iz_table-line iz_toggle-block">
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        title={tCore("modals.deleteModal.title")}
        message={t("modals.delteModal.description")}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText={tCore("button.delete")}
        cancelText={tCore("button.confirm")}
      />
      <h3
        className={`iz_toggle-title ${
          transactionItemsOpen ? "iz_is-open" : ""
        }`}
        onClick={() => setTransactionItemsOpen(!transactionItemsOpen)}>
        {t("documentView.Item")}
      </h3>
      <div
        className={`iz_content-fields ${
          transactionItemsOpen ? "iz_is-open" : ""
        }`}>
        <div className="iz_table-container">
          <table>
            <thead>
              <tr>
                <th>{t("documentView.ItemDescription")}</th>
                <th>{t("documentView.ItemQte")}</th>
                <th>{t("documentView.ItemUnitPrice")}</th>
                <th>{t("documentView.ItemPrice")}</th>
                <th>{t("documentView.ItemAction")}</th>
              </tr>
            </thead>
            <tbody>
              {mappedTransactionItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="iz_field iz_field-item">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleTransactionItemChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </td>
                  <td>
                    <div className="iz_field iz_field-qty">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          handleTransactionItemChange(
                            index,
                            "quantity",
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </div>
                  </td>
                  <td>
                    <div className="iz_field iz_field-united-price">
                      <input
                        type="text"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleTransactionItemChange(
                            index,
                            "unit_price",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </div>
                  </td>
                  <td>
                    <div className="iz_field iz_field-price">
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) =>
                          handleTransactionItemChange(
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
                      onClick={() => handleDeleteClick(index)}
                      className="iz_file-delete-upload iz_text-error"
                      title="Remove upload"></a>
                    {/* <button 
                      type="button" 
                      className="iz_btn iz_btn-danger"
                      onClick={() => handleDeleteClick(index)}
                    >
                      Delete
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="iz_more-line">
          <button type="button" onClick={handleAddItem}>
            + {t("documentView.ItemAddItem")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItemsSection;
