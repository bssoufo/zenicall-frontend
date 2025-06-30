import React from "react";
import { ReceiptData } from "../../models/DocumentModel";
import { useTranslation } from "react-i18next";

interface FinancialSummarySectionProps {
  formData: ReceiptData;
  financialSummaryOpen: boolean;
  setFinancialSummaryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFinancialSummaryChange: <K extends keyof ReceiptData>(
    key: K,
    value: ReceiptData[K]
  ) => void;
}

const FinancialSummarySection: React.FC<FinancialSummarySectionProps> = ({
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
                <th> {t("documentView.financialSummarySubtotal")}</th>
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
                <th> {t("documentView.financialShippingAmount")}</th>
                <td>
                  <table>
                    <tr>
                      <td>
                        <div className="iz_field">
                          <input
                            type="text"
                            value={formData?.shipping_amount ?? ""}
                            onChange={(e) =>
                              handleFinancialSummaryChange(
                                "shipping_amount",
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
                            value={formData?.shipping_metod ?? ""}
                            onChange={(e) =>
                              handleFinancialSummaryChange(
                                "shipping_metod",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <th> {t("documentView.financialSummaryTip")}</th>
                <td>
                  <div className="iz_field">
                    <input
                      type="text"
                      value={formData?.tip ?? ""}
                      onChange={(e) =>
                        handleFinancialSummaryChange(
                          "tip",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th> {t("documentView.financialSummaryTotal")}</th>
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
                <th> {t("documentView.financialSummaryPanelCurency")}</th>
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
              <tr>
                <th> {t("documentView.financialSummaryTendered")}</th>
                <td>
                  <div className="iz_field">
                    <input
                      type="text"
                      value={formData?.tendered_amount ?? ""}
                      onChange={(e) =>
                        handleFinancialSummaryChange(
                          "tendered_amount",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th> {t("documentView.financialSummaryChange")}</th>
                <td>
                  <div className="iz_field">
                    <input
                      type="text"
                      value={formData?.change_amount ?? ""}
                      onChange={(e) =>
                        handleFinancialSummaryChange(
                          "change_amount",
                          parseFloat(e.target.value)
                        )
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

export default FinancialSummarySection;
