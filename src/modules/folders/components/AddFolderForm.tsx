// src/components/UI/Folder/add_folder/AddFolderForm.tsx
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AppEnv } from "../../../config/AppEnv";
import Folder, { FolderCreateDto } from "../FolderModel";
import FolderService from "../FolderService";
import Loader, { LoadingScreen } from "../../../@zenidata/components/UI/Loader";
import CustomSelect from "../../../@zenidata/components/CustomSelect";

interface Props {
  initialFolder?: Folder | null;
}

interface ValidationErrors {
  [key: string]: string;
}

function AddFolderForm({ initialFolder }: Props) {
  const { t: tCore } = useTranslation("core");
  const { t } = useTranslation("folders");
  const navigate = useNavigate();

  const [form, setForm] = useState<FolderCreateDto>({
    name: "",
    receptionEmail: "",
    documentType: "",
    retentionDuration: "",
    status: "active",
    language: "",
  });

  const [documentTypesEnum, setDocumentTypesEnum] = useState<string[]>([]);
  // const [documentTypesOptions, setDocumentTypesOptions] = useState<
  //   { label: string; value: string }[]
  // >([]);

  const [loadingInit, setLoadingInit] = useState(false);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const receptionEmailDomain = AppEnv.RECEPTION_EMAIL_DOMAIN || "@example.com"; // Domaine depuis .env
  // const retentionDurations = [
  //   { value: "1", label: "1 day" },
  //   { value: "7", label: "7 days" },
  //   { value: "30", label: "30 days" },
  //   { value: "60", label: "60 days" },
  //   { value: "90", label: "90 days" },
  //   { value: "180", label: "180 days" },
  //   { value: "365", label: "365 days" },
  //   { value: "", label: "Unlimited" },
  // ];

  const [loading, setLoading] = React.useState(false);

  const fetchDocumentTypes = async () => {
    try {
      const response = await FolderService.getAllowedDocumentTypes();
      setDocumentTypesEnum(response);

      // const options = response.map((type) => ({
      //   value: type,
      //   label: t(`addFolder.documentTypeOptions.${type}`),
      // }));
      // setDocumentTypesOptions(options);
    } catch (err) {
      alert(t("folder.api_messages.generic_error"));
    }
  };

  useEffect(() => {
    (async () => {
      setLoadingInit(true);
      await fetchDocumentTypes();
      setLoadingInit(false);

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
    })();
  }, [initialFolder]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
    if (name === "receptionEmail") {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    console.log(form);

    if (!form.name)
      newErrors.name = t("folder.api_messages.MISSING_REQUIRED_FIELDS");
    // if (!form.receptionEmail) {
    //   newErrors.receptionEmail = t(
    //     "folder.api_messages.MISSING_REQUIRED_FIELDS"
    //   );
    // } else {
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //   if (!emailRegex.test(form.receptionEmail + receptionEmailDomain)) {
    //     newErrors.receptionEmail = t(
    //       "folder.api_messages.INVALID_EMAIL_FORMAT"
    //     );
    //   }
    // }
    if (!form.documentType)
      newErrors.documentType = t("folder.api_messages.MISSING_REQUIRED_FIELDS");
    // if (!form.retentionDuration) {
    //   newErrors.retentionDuration = t(
    //     "folder.api_messages.INVALID_RETENTION_DURATION"
    //   );
    // } else if (form.retentionDuration !== "" && +form.retentionDuration <= 0) {
    //   newErrors.retentionDuration = t(
    //     "folder.api_messages.INVALID_RETENTION_DURATION"
    //   );
    // }
    /*if (!form.status)
      newErrors.status = t("folder.api_messages.MISSING_REQUIRED_FIELDS");*/
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // console.log(form);
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload: FolderCreateDto = {
        ...form,
        // receptionEmail: form.receptionEmail + receptionEmailDomain,
        // retentionDuration:
        //   form.retentionDuration === "" ? "" : form.retentionDuration,
        retentionDuration: "0",
      };

      delete form.language;

      setLoading(true);
      if (initialFolder?.id) {
        await FolderService.updateFolder(initialFolder.id, payload);
        setLoading(false);
      } else {
        await FolderService.addFolder(payload);
        setLoading(false);
      }
      // alert(t(`folder.api_messages.${response.api_message}`));
      navigate("/folders");
    } catch (err: any) {
      if (err.response?.data?.api_message) {
        alert(t(`folder.api_messages.${err.response.data.api_message}`));
        setLoading(false);
      } else {
        alert(t("folder.api_messages.generic_error"));
        setLoading(false);
      }
    }
  };

  // const handleSelectChange = (selectedOption) => {
  //   handleChange({
  //     target: {
  //       name: "documentType",
  //       value: selectedOption ? selectedOption.value : "",
  //     },
  //   } as any);
  // };

  // const customStyles = {
  //   control: (provided) => ({
  //     ...provided,
  //     height: "40px", // Hauteur du select
  //     minHeight: "40px", // Assurer une hauteur minimum
  //     borderRadius: "8px", // Bordures arrondies
  //     borderColor: "#ccc", // Couleur de la bordure
  //     boxShadow: "none", // Supprimer l'effet de focus par défaut
  //     "&:hover": {
  //       borderColor: "#888", // Couleur au survol
  //     },
  //   }),
  //   valueContainer: (provided) => ({
  //     ...provided,
  //     height: "40px",
  //     padding: "0 8px",
  //   }),
  //   input: (provided) => ({
  //     ...provided,
  //     margin: "0px",
  //     boxShadow: "none",
  //   }),
  //   indicatorsContainer: (provided) => ({
  //     ...provided,
  //     height: "40px",
  //   }),
  // };

  if (loadingInit) return <LoadingScreen />;

  return (
    // <form onSubmit={handleSubmit} className="add-folder-form">
    //   <div className="form-group">
    //     <label>{t("folder.Name")}:</label>
    //     <input
    //       type="text"
    // name="name"
    // value={form.name}
    // onChange={handleChange}
    // required
    //     />
    //     {errors.name && <span className="error-message">{errors.name}</span>}
    //   </div>
    //   <div className="form-group">
    //     <label>{t("folder.ReceptionEmail")}:</label>
    //     <div className="email-input-group">
    //       <input
    //         type="text"
    // name="receptionEmail"
    // value={form.receptionEmail || ""}
    // onChange={handleChange}
    // required
    //       />
    //       <span className="email-domain">{receptionEmailDomain}</span>
    //     </div>
    // {errors.receptionEmail && (
    //   <span className="error-message">{errors.receptionEmail}</span>
    // )}
    //   </div>
    //   <div className="form-group">
    //     <label>{t("folder.DocumentType")}:</label>
    //     <select
    //       name="documentType"
    //       value={form.documentType}
    //       onChange={handleChange}
    //       required>
    //       <option value="">{t("folder.SelectDocumentType")}</option>
    //       {documentTypes.map((type) => (
    //         <option key={type} value={type}>
    //           {t(`folder.${type}`)}
    //         </option>
    //       ))}
    //     </select>
    // {errors.documentType && (
    //   <span className="error-message">{errors.documentType}</span>
    // )}
    //   </div>
    //   <div className="form-group">
    //     <label htmlFor="retentionDuration">
    //       {t("folder.RetentionDuration")}:
    //     </label>
    //     <select
    //       id="retentionDuration"
    //       name="retentionDuration"
    //       value={form.retentionDuration}
    //       onChange={handleChange}>
    //       {retentionDurations.map((duration) => (
    //         <option key={duration.value} value={duration.value}>
    //           {t(`folder.${duration.label}`)}
    //         </option>
    //       ))}
    //     </select>
    // {errors.retentionDuration && (
    //   <span className="error-message">{errors.retentionDuration}</span>
    // )}
    //   </div>
    //   <div className="form-group">
    //     <label>{t("folder.Status")}:</label>
    //     <select
    //       name="status"
    //       value={form.status}
    //       onChange={handleChange}
    //       required>
    //       <option value="active">{t("folder.Active")}</option>
    //       <option value="archived">{t("folder.Archived")}</option>
    //     </select>
    // {errors.status && (
    //   <span className="error-message">{errors.status}</span>
    // )}
    //   </div>
    //   <button type="submit" className="submit-button">
    //     {loading ? <Loader /> : t("folder.Submit")}
    //   </button>
    // </form>

    <form onSubmit={handleSubmit}>
      <div className="iz_fields iz_flex">
        <div className="iz_field iz_field-half iz_field-has-limit-text">
          <label>
            {t("addFolder.folderNameLabel")} <sup>*</sup>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder={t("addFolder.folderNamePlaceholder")}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
          <span className="iz_field-limit">0/50</span>
        </div>
        {/* <div className="iz_field iz_field-half">
          <label>
            Reception Email <sup>*</sup>
          </label>
          <input
            type="text"
            name="receptionEmail"
            value={form.receptionEmail || ""}
            onChange={handleChange}
            required
            placeholder="eg:xyz@gmail.com"
          />
          {errors.receptionEmail && (
            <span className="error-message">{errors.receptionEmail}</span>
          )}
        </div> */}
        <div className="iz_field iz_field-select iz_field-half">
          <label>
            {t("addFolder.documentTypeLabel")}
            <sup>*</sup>
          </label>
          {/* <select
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
          </select> */}
          {/* <Select
            name="documentType"
            value={
              documentTypesOptions.find(
                (opt) => opt.value === form.documentType
              ) || null
            }
            onChange={handleSelectChange}
            options={documentTypesOptions}
            placeholder={t("folder.SelectDocumentType")}
            isClearable
            required
            styles={customStyles}
          /> */}
          {/* <CustomSelect
            name="documentType"
            value={form.documentType}
            options={documentTypesOptions}
            onChange={handleChange}
            placeholder={t("addFolder.documentTypePlaceholder")}
          /> */}
            <select 
          name="documentType"
          value={form.documentType}
          onChange={handleChange}
          required
        >
          <option value="">{t("addFolder.documentTypePlaceholder")}</option>
          {documentTypesEnum.map((optionEnum) => (
            <option key={optionEnum} value={optionEnum}>
              {t(`addFolder.documentTypeOptions.${optionEnum}`)}
            </option>
          ))}
        </select>
        {errors.documentType && (
          <span className="error-message">{errors.documentType}</span>
        )}
        </div>
      </div>
      {/* <div className="iz_fields iz_flex">
        <div className="iz_field iz_field-half iz_field-select">
          <label>
            Extraction Language <sup>*</sup>
          </label>
          <select>
            <option>Select extraction language </option>
            <option>English</option>
          </select>
          <CustomSelect
            name="language"
            value={form.language}
            options={[
              { label: "English", value: "en" },
              { label: "French", value: "fr" },
            ]}
            onChange={handleChange}
            placeholder={t("folder.SelectDocumentType")}
          />
        </div>
      </div> */}
      {/* <div className="iz_fields iz_flex">
        <div className="iz_field iz_field-half iz_field-select">
          <label>
            Retention Duration (days) <sup>*</sup>
          </label>
           <select
            name="retentionDuration"
            value={form.retentionDuration}
            onChange={handleChange}>
            <option>Select document type</option>
            {retentionDurations.map((duration) => (
              <option key={duration.value} value={duration.value}>
                {t(`folder.${duration.label}`)}
              </option>
            ))}
          </select>
          <CustomSelect
            name="retentionDuration"
            value={form.retentionDuration}
            options={retentionDurations.map((duration) => ({
              label: duration.label,
              value: duration.value,
            }))}
            onChange={handleChange}
            placeholder={t("folder.SelectDocumentType")}
          />

          {errors.retentionDuration && (
            <span className="error-message">{errors.retentionDuration}</span>
          )}
        </div>
      </div> */}
      {/* <div className="iz_field iz_field-wyswyg">
        <label>
          Description <sup>*</sup>
        </label>
        <textarea></textarea>
      </div> */}
      {/* <div className="iz_field  iz_field_radio">
        <label>
          Statut <sup>*</sup>
        </label>
        <div className="iz_group-radio iz_flex">
          <div className="iz_field iz_field-radio">
            <input
              value={"active"}
              onChange={handleChange}
              type="radio"
              name="status"
              id="iz_active-radio"
            />
            <label htmlFor="iz_active-radio">Active</label>
          </div>
          <div className="iz_field iz_field-radio">
            <input
              value={"archive"}
              onChange={handleChange}
              type="radio"
              name="status"
              id="iz_archive-radio"
            />
            <label htmlFor="iz_archive-radio">Archive</label>
          </div>
          {errors.status && (
            <span className="error-message">{errors.status}</span>
          )}
        </div>
      </div> */}

      {/* <div className="iz_box iz_box-uplaod iz_position-relative">
        <div className="iz_box-content">
          <h2>Upload document</h2>
          <p>
            Figma ipsum component variant main layer. Vector subtract bullet
            team edit vertical export image comment. Flatten follower mask
            prototype style select arrow slice. Figma ipsum component variant
            main layer. Vector subtract bullet team edit vertical export image
            comment. Flatten follower mask prototype style select arrow slice.
          </p>
          <div className="iz_field iz_file iz_position-relative">
            <input type="file" id="" />
            <span className="iz_btn-primary iz_btn iz_input-file">
              Upload Document
            </span>
          </div>
        </div>
      </div> */}

      <div className="iz_btns-actions iz_flex iz_position-relative">
        <button
          onClick={() => navigate("/folders")}
          className="iz_btn iz_btn-submit iz_btn-white"
          type="reset">
          {tCore("cancel")}
        </button>
        <button className="iz_btn iz_btn-submit" type="submit">
          {/* Add folder */}
          {loading ? <Loader /> : t("Submit")}
        </button>
      </div>
    </form>
  );
}

export default AddFolderForm;
