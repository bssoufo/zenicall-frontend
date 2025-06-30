import React, { useTransition } from "react";
import { PaymentMethod } from "../models/DocumentModel";
import { useTranslation } from "react-i18next";

interface PaymentMethodProps {
  paymentMethod: PaymentMethod;
  handlePaymentMethodChange: <K extends keyof PaymentMethod>(
    key: K,
    value: PaymentMethod[K]
  ) => void;
  paymentOpen: boolean;
  setPaymentOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentMethodComponent: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  handlePaymentMethodChange,
  paymentOpen,
  setPaymentOpen,
}) => {
  const { t } = useTranslation("documents");
  return (
    <div className="iz_payment-method iz_toggle-block">
      <h3
        className={`iz_toggle-title ${paymentOpen ? "iz_is-open" : ""}`}
        onClick={() => setPaymentOpen(!paymentOpen)}>
        {t("documentView.paymentMethode")}
      </h3>
      <div className={`iz_content-fields ${paymentOpen ? "iz_is-open" : ""}`}>
        <div className="iz_fields iz_flex">
          <div className="iz_field iz_field-half">
            <label>{t("documentView.paymentMethodeAccountName")}</label>
            <input
              type="text"
              value={paymentMethod?.account_name ?? ""}
              onChange={(e) =>
                handlePaymentMethodChange("account_name", e.target.value)
              }
            />
          </div>
          <div className="iz_field iz_field-half">
            <label>{t("documentView.paymentMethodeAccountNumber")}</label>
            <input
              type="text"
              value={paymentMethod?.account_number ?? ""}
              onChange={(e) =>
                handlePaymentMethodChange("account_number", e.target.value)
              }
            />
          </div>
        </div>
        <div className="iz_fields iz_flex">
          <div className="iz_field iz_field-half">
            <label>{t("documentView.paymentMethodeIBAN")}</label>
            <input
              type="text"
              value={paymentMethod?.iban ?? ""}
              onChange={(e) =>
                handlePaymentMethodChange("iban", e.target.value)
              }
            />
          </div>
          <div className="iz_field iz_field-half">
            <label>{t("documentView.paymentMethodeSwiftCode")}</label>
            <input
              type="text"
              value={paymentMethod?.swift_code ?? ""}
              onChange={(e) =>
                handlePaymentMethodChange("swift_code", e.target.value)
              }
            />
          </div>
        </div>
        <div className="iz_field">
          <label>{t("documentView.paymentMethodeMethodName")}</label>
          <input
            type="text"
            value={paymentMethod?.method_name ?? ""}
            onChange={(e) =>
              handlePaymentMethodChange("method_name", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodComponent;
