// src/components/UI/Folder/add_folder/AddFolderForm.tsx
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../@zenidata/components/UI/Loader";
import { AppEnv } from "../../../../config/AppEnv";
import Folder, { FolderCreateDto } from "../../FolderModel";
import FolderService from "../../FolderService";

interface Props {
  initialFolder?: Folder | null;
}

interface ValidationErrors {
  [key: string]: string;
}

function AddFolderForm({ initialFolder }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState<FolderCreateDto>({
    name: "",
    receptionEmail: "",
    documentType: "",
    retentionDuration: "",
    status: "active",
    language: "",
  });

  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const receptionEmailDomain = AppEnv.RECEPTION_EMAIL_DOMAIN || "@example.com"; // Domaine depuis .env
  const retentionDurations = [
    { value: "1", label: "1 day" },
    { value: "7", label: "7 days" },
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
    { value: "180", label: "180 days" },
    { value: "365", label: "365 days" },
    { value: "", label: "Unlimited" },
  ];

  const [loading, setLoading] = React.useState(false);

  const fetchDocumentTypes = async () => {
    try {
      const response = await FolderService.getAllowedDocumentTypes();
      setDocumentTypes(response);
    } catch (err) {
      alert(t("folder.api_messages.generic_error"));
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
    if (initialFolder) {
      setForm({
        name: initialFolder.name,
        receptionEmail: initialFolder.reception_email.split("@")[0], // On retire le domaine à l'initialisation
        documentType: initialFolder.document_type,
        retentionDuration: String(initialFolder.retention_duration),
        status: initialFolder.status,
        language: initialFolder.language,
      });
    }
  }, [initialFolder]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "receptionEmail") {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!form.name)
      newErrors.name = t("folder.api_messages.MISSING_REQUIRED_FIELDS");
    if (!form.receptionEmail) {
      newErrors.receptionEmail = t(
        "folder.api_messages.MISSING_REQUIRED_FIELDS"
      );
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(form.receptionEmail + receptionEmailDomain)) {
        newErrors.receptionEmail = t(
          "folder.api_messages.INVALID_EMAIL_FORMAT"
        );
      }
    }
    if (!form.documentType)
      newErrors.documentType = t("folder.api_messages.MISSING_REQUIRED_FIELDS");
    if (!form.retentionDuration) {
      newErrors.retentionDuration = t(
        "folder.api_messages.INVALID_RETENTION_DURATION"
      );
    } else if (form.retentionDuration !== "" && +form.retentionDuration <= 0) {
      newErrors.retentionDuration = t(
        "folder.api_messages.INVALID_RETENTION_DURATION"
      );
    }
    if (!form.status)
      newErrors.status = t("folder.api_messages.MISSING_REQUIRED_FIELDS");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload: FolderCreateDto = {
        ...form,
        receptionEmail: form.receptionEmail + receptionEmailDomain,
        retentionDuration:
          form.retentionDuration === "" ? "" : form.retentionDuration,
      };

      setLoading(true);
      if (initialFolder?.id) {
        await FolderService.updateFolder(initialFolder.id, payload);
        setLoading(false);
      } else {
        await FolderService.addFolder(payload);
        setLoading(false);
      }
      // alert(t(`folder.api_messages.${response.api_message}`));
      navigate("/");
    } catch (err: any) {
      if (err.response?.data?.api_message) {
        alert(t(`folder.api_messages.${err.response.data.api_message}`));
      } else {
        alert(t("folder.api_messages.generic_error"));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-folder-form">
      <div className="form-group">
        <label>{t("folder.Name")}:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>
      <div className="form-group">
        <label>{t("folder.ReceptionEmail")}:</label>
        <div className="email-input-group">
          <input
            type="text"
            name="receptionEmail"
            value={form.receptionEmail || ""}
            onChange={handleChange}
            required
          />
          <span className="email-domain">{receptionEmailDomain}</span>
        </div>
        {errors.receptionEmail && (
          <span className="error-message">{errors.receptionEmail}</span>
        )}
      </div>
      <div className="form-group">
        <label>{t("folder.DocumentType")}:</label>
        <select
          name="documentType"
          value={form.documentType}
          onChange={handleChange}
          required>
          <option value="">{t("folder.SelectDocumentType")}</option>
          {documentTypes.map((type) => (
            <option key={type} value={type}>
              {t(`folder.${type}`)}
            </option>
          ))}
        </select>
        {errors.documentType && (
          <span className="error-message">{errors.documentType}</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="retentionDuration">
          {t("folder.RetentionDuration")}:
        </label>
        <select
          id="retentionDuration"
          name="retentionDuration"
          value={form.retentionDuration}
          onChange={handleChange}>
          {retentionDurations.map((duration) => (
            <option key={duration.value} value={duration.value}>
              {t(`folder.${duration.label}`)}
            </option>
          ))}
        </select>
        {errors.retentionDuration && (
          <span className="error-message">{errors.retentionDuration}</span>
        )}
      </div>
      <div className="form-group">
        <label>{t("folder.Status")}:</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          required>
          <option value="active">{t("folder.Active")}</option>
          <option value="archived">{t("folder.Archived")}</option>
        </select>
        {errors.status && (
          <span className="error-message">{errors.status}</span>
        )}
      </div>
      <button type="submit" className="submit-button">
        {loading ? <Loader /> : t("folder.Submit")}
      </button>
    </form>
  );
}

export default AddFolderForm;
