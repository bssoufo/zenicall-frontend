import React from "react";
import { BackendDocumentData } from "../../../../models/DocumentModel";
import { useTranslation } from "react-i18next";

interface InvoiceFinancialSummarySectionProps {
  formData: BackendDocumentData;
  financialSummaryOpen: boolean;
  setFinancialSummaryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFinancialSummaryChange: <K extends keyof BackendDocumentData>(
    key: K,
    value: BackendDocumentData[K]
  ) => void;
}

const InvoiceFinancialSummarySection: React.FC<
  InvoiceFinancialSummarySectionProps
> = ({
  formData,
  financialSummaryOpen,
  setFinancialSummaryOpen,
  handleFinancialSummaryChange,
}) => {
  const { t } = useTranslation("documents");

  return (
    <div className="iz_financial-summary iz_toggle-block">
      <h3
        className={`iz_toggle-title ${
          financialSummaryOpen ? "iz_is-open" : ""
        }`}
        onClick={() => setFinancialSummaryOpen(!financialSummaryOpen)}>
        {t("documentView.financialSummaryPanel")}
      </h3>
      <div
        className={`iz_content-fields ${
          financialSummaryOpen ? "iz_is-open" : ""
        }`}>
        <div className="iz_table-container">
          <table>
            <tbody>
              <tr>
                <th>{t("documentView.subTotal")}</th>
                <td>
                  <div className="iz_field">
                    <input
                      type="text"
                      value={formData?.sub_total_amount ?? ""}
                      onChange={(e) =>
                        handleFinancialSummaryChange(
                          "sub_total_amount",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th>{t("documentView.total")}</th>
                <td>
                  <div className="iz_field">
                    <input
                      type="text"
                      value={formData?.total_amount ?? ""}
                      onChange={(e) =>
                        handleFinancialSummaryChange(
                          "total_amount",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th>{t("documentView.currency")}</th>
                <td>
                  <div className="iz_field">
                    <input
                      type="text"
                      value={formData?.currency ?? ""}
                      onChange={(e) =>
                        handleFinancialSummaryChange("currency", e.target.value)
                      }
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFinancialSummarySection;
