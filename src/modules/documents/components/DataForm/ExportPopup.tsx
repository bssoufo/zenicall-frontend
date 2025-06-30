import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import {
  getInvoiceFields,
  getReceiptFields,
  DocumentFieldsConfig,
} from "./field-configs";
import "./ExportPopup.css";
import i18n from "../../../../core/translation/i18n";

export type ExportFormat = "csv" | "excel";
export type ExportDocumentType = "receipt" | "invoice";

export interface ExportPayload {
  document_ids: number[];
  format: ExportFormat;
  fields?: string[];
  document_type?: ExportDocumentType;
}

interface ExportPopupProps {
  documentIds: number[];
  documentType: ExportDocumentType;
  onClose: () => void;
  onExport: (payload: ExportPayload) => void;
}

const translate = (key: string) => key;

export const ExportPopup = ({
  documentIds,
  documentType,
  onClose,
  onExport,
}: ExportPopupProps) => {
  const FIELD_CONFIG: { [key in ExportDocumentType]: DocumentFieldsConfig } = {
    receipt: {
      fields: getReceiptFields(),
      displayName: translate("Receipt"),
    },
    invoice: {
      fields: getInvoiceFields(),
      displayName: translate("Invoice"),
    },
  };

  const [format, setFormat] = useState<ExportFormat>("csv");
  const [selectAll, setSelectAll] = useState(true);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [fieldOptions, setFieldOptions] = useState<
    { value: string; label: string }[]
  >([]); // Add fieldOptions state
  const { t } = useTranslation();
  const documentDisplayName = FIELD_CONFIG[documentType].displayName;

  useEffect(() => {
    setFieldOptions(
      FIELD_CONFIG[documentType].fields.map((field) => ({
        value: field.technical,
        label: t(field.display),
      }))
    );
  }, [documentType, i18n.language]); // Depend on documentType

  useEffect(() => {
    if (selectAll) {
      setSelectedFields([]);
    }
  }, [selectAll]);

  useEffect(() => {
    setSelectAll(true);
    setSelectedFields([]);
    setError("");
  }, [documentType]);

  const handleSubmit = useCallback(() => {
    if (!selectAll && selectedFields.length === 0) {
      setError(translate("Please select at least one column to export"));
      return;
    }

    const payload: ExportPayload = {
      document_ids: documentIds,
      format,
      document_type: documentType,
      fields: selectAll ? undefined : selectedFields,
    };

    onExport(payload);
    onClose();
  }, [
    documentIds,
    documentType,
    format,
    onExport,
    onClose,
    selectedFields,
    selectAll,
  ]);

  const handleFieldSelectChange = (
    selectedOptions: { value: string; label: string }[] | null
  ) => {
    setError("");
    setSelectAll(false);
    setSelectedFields(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedFields([]);
    setError("");
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>
          {t("Export")} {documentDisplayName}s
        </h3>
        {documentIds.length > 1 && (
          <p>
            {t("Exporting")} {documentIds.length} {t("selected")}{" "}
            {documentDisplayName.toLowerCase()}s
          </p>
        )}

        {/* Format Selection */}
        <div className="iz_field">
          <label>{t("Format")}:</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
            className="iz_select">
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
          </select>
        </div>

        {/* Export All Columns Checkbox */}
        <div className="iz_field">
          <label className="iz_checkbox-label">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={(e) => handleSelectAllChange(e.target.checked)}
              className="iz_checkbox"
            />
            {t("Export All Columns")}
          </label>
        </div>

        {/* Columns Selection using react-select */}
        {!selectAll && (
          <div className="iz_field">
            <label className="iz_label">{t("Select Columns to Export")}:</label>
            <Select
              isMulti
              name="fields"
              options={fieldOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleFieldSelectChange}
              placeholder={t("Select Columns...")}
            />
            {error && <p className="iz_error-message">{error}</p>}
          </div>
        )}

        {/* Action Buttons */}
        <div className="dialog-actions">
          <button
            className="dialog-button cancel-button"
            onClick={onClose}
            type="button">
            {t("Cancel")}
          </button>
          <button
            className="dialog-button confirm-button"
            onClick={handleSubmit}
            type="button">
            {t("Export")}
          </button>
        </div>
      </div>
    </div>
  );
};
