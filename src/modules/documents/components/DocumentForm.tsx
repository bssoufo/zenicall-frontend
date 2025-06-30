// src/components/Documents/DocumentForm.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import CameraCapture from "../../../@zenidata/components/UI/Camera/CameraCapture";
import Loader from "../../../@zenidata/components/UI/Loader";
import { AppEnv } from "../../../config/AppEnv";
import DocumentService from "../services/DocumentService";
import { formatFileSize } from "../../../@zenidata/utils";

interface DocumentFormProps {
  folderId: string;
}

interface FilePreview {
  file: File;
  name: string;
  type: string;
  size: number;
  url: string;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ folderId }) => {
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("documents");
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{ fichiers: File[] }>({
    fichiers: [],
  });
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  // @ts-ignore
  const [cameraFile, setCameraFile] = useState<File | null>(null);

  const maxFiles = parseInt(AppEnv.MAX_UPLOAD_FILES?.toString() || "5", 10);
  const allowedFileTypes = AppEnv.ALLOWED_FILE_TYPES || "image/*,.pdf";

  const isFileTypeAllowed = (file: File): boolean => {
    const mime = file.type.toLowerCase();
    return mime.startsWith("image/") || mime === "application/pdf";
  };

  const processFiles = (fileList: FileList) => {
    let selectedFiles = Array.from(fileList);
    selectedFiles = selectedFiles.filter(isFileTypeAllowed).slice(0, maxFiles);
    setFormData((prev) => ({
      ...prev,
      fichiers: [...prev.fichiers, ...selectedFiles],
    }));
  };

  const handleCameraCapture = (file: File | null) => {
    if (file) {
      setCameraFile(file);
      setFormData((prev) => ({
        ...prev,
        fichiers: [...prev.fichiers, file],
      }));
    }
    setIsCameraOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  useEffect(() => {
    console.log(formData.fichiers);
    filePreviews.forEach((prev) => URL.revokeObjectURL(prev.url));
    const newPreviews = formData.fichiers.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    setFilePreviews(newPreviews);

    return () => {
      newPreviews.forEach((prev) => URL.revokeObjectURL(prev.url));
    };
  }, [formData.fichiers]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (formData.fichiers.length === 0 && !isCameraOpen) {
      newErrors.fichiers = t("documents.errors.fileRequired");
    }
    if (formData.fichiers.length > maxFiles) {
      newErrors.fichiers = t("documents.errors.maxFiles", { count: maxFiles });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    if (isCameraOpen) return;
    if (!validate()) return;
    setLoading(true);
    try {
      await Promise.all(
        formData.fichiers.map(async (file) => {
          const submissionData = new FormData();
          submissionData.append("name", file.name);
          submissionData.append("status", "pending");
          submissionData.append("folder_id", folderId);
          submissionData.append("file", file);
          await DocumentService.createDocument(submissionData);
        })
      );
      navigate(`/folders/${folderId}`);
    } catch (err) {
      setSubmitError(t("documents.api_messages.submitError"));
      setLoading(false);
    }
    // finally {
    // }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      fichiers: prev.fichiers.filter((_, i) => i !== indexToRemove),
    }));
  };

  return (
    // <form className="document-form" onSubmit={handleSubmit}>
    //   {submitError && <p className="error">{submitError}</p>}
    //   <p className="upload-message">
    //     {t("documents.dragdrop.instruction") ||
    //       "Déposez vos fichiers dans la zone ci-dessous ou cliquez pour parcourir"}
    //   </p>
    //   <div
    //     className={`drop-zone ${isDragOver ? "drag-over" : ""}`}
    // onDragOver={handleDragOver}
    // onDragLeave={handleDragLeave}
    // onDrop={handleDrop}
    // onClick={() => document.getElementById("fileInput")?.click()}>
    //     <p>
    //       {t("documents.dragdrop.label") ||
    //         "Glissez et déposez vos fichiers ici, ou cliquez pour sélectionner"}
    //     </p>
    //     <input
    //       id="fileInput"
    // type="file"
    // name="fichiers"
    // accept={allowedFileTypes}
    // multiple
    // onChange={handleChange}
    //       className="file-input-ghost"
    //     />
    //   </div>
    //   <button type="button" onClick={() => setIsCameraOpen(true)}>
    //     {t("documents.takePicture")}
    //   </button>
    //   {isCameraOpen && <CameraCapture onCapture={handleCameraCapture} />}
    //   {errors.fichiers && !isCameraOpen && (
    //     <p className="error">{errors.fichiers}</p>
    //   )}
    //   <div className="selected-files">
    //     {filePreviews.map((preview, index) => (
    //       <div key={index} className="selected-file-item">
    //         <span>{preview.name}</span>
    //         {preview.type.includes("image") && (
    //           <a
    //             href={preview.url}
    //             target="_blank"
    //             rel="noopener noreferrer"
    //             style={{ color: "#2980b9" }}>
    //             [Preview Image]
    //           </a>
    //         )}
    //         {preview.type.includes("pdf") && (
    //           <a
    //             href={preview.url}
    //             target="_blank"
    //             rel="noopener noreferrer"
    //             style={{ color: "#e74c3c" }}>
    //             [Open PDF]
    //           </a>
    //         )}
    //         <button
    //           type="button"
    //           className="remove-file-button"
    //           onClick={() => handleRemoveFile(index)}>
    //           x
    //         </button>
    //       </div>
    //     ))}
    //   </div>
    //   <button type="submit" className="submit-button" disabled={loading}>
    //     {/* {loading
    //       ? t("documents.form.submitLoading")
    //       : t("documents.form.submit")} */}

    // {loading ? (
    //   <Loader label={t("documents.form.submitLoading")} />
    // ) : (
    //   t("documents.form.submit")
    // )}
    //   </button>
    // </form>

    <>
      <form onSubmit={handleSubmit}>
        <div
          className={`iz_box-add-doc iz_bg-white iz_box drop-zone ${
            isDragOver ? "drag-over" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}>
          <div className="iz_center">
            <div className="iz_thumb">
              <img alt="" src="assets/img/upload.png" />
            </div>
            <span className="iz_text-drag">
              {t("addDocument.dragInputDescription")}
            </span>
            <div className="iz_separator iz_position-relative">
              <span> {t("addDocument.or")}</span>
            </div>
            <div className="iz_field-file iz_position-relative">
              <input
                style={{ display: "none" }}
                type="file"
                id="fileInput"
                name="fichiers"
                accept={allowedFileTypes}
                multiple
                onChange={handleChange}
              />
              <button type="button" className="iz_btn iz_btn-white">
                {t("addDocument.browseFiles")}
              </button>
            </div>
          </div>
        </div>
        <div className="iz_flex iz_sub-box">
          <div className="iz_text-format">
            <span>{t("addDocument.supportedFileDescription")}</span>
          </div>
          {/* <div className="iz_capure">
            <button
              onClick={() => setIsCameraOpen(true)}
              className="iz_capture-btn iz_btn iz_light-btn"
              type="button">
              Capture Image
            </button>
          </div>
          <div>
            {isCameraOpen && <CameraCapture onCapture={handleCameraCapture} />}
            {errors.fichiers && !isCameraOpen && (
              <p className="error">{errors.fichiers}</p>
            )}
          </div> */}
        </div>
        {/* <div className="iz_doc-settings">
          <h2>Document settings</h2>
          <div className="iz_fields iz_fields-checkbox iz_flex">
            <div className="iz_field iz_position-relative">
              <input type="checkbox" id="iz_field-multiple" />
              <div className="iz_position-relative iz_checkbox-label">
                <label htmlFor="iz_field-multiple">
                  Does the document have multiple pages?
                </label>
                <p>
                  Choosing this option may increase processing time as it is
                  optimized for handling longer documents.
                </p>
              </div>
            </div>
            <div className="iz_field iz_position-relative">
              <input type="checkbox" id="iz_field-pdf" />
              <div className="iz_position-relative iz_checkbox-label">
                <label htmlFor="iz_field-pdf">
                  {" "}
                  Do you want to process only specific pages? (PDFs only){" "}
                </label>
                <p>
                  The document will be automatically trimmed to include only the
                  selected pages.
                </p>
              </div>
            </div>
            <div className="iz_field iz_position-relative">
              <input type="checkbox" id="iz_field-handwritting" />
              <div className="iz_position-relative iz_checkbox-label">
                <label htmlFor="iz_field-handwritting">
                  Is the document handwritten?
                </label>
              </div>
            </div>
          </div>
        </div> */}

        <div className="iz_docs-progressbar">
          {filePreviews.map((preview, index) => (
            // <div key={index} className="iz_item-progress-bar iz_item-file ">
            //   <div className="iz_flex iz_item-file-details">
            //     <div className="iz_item-file-name">
            //       <span>{preview.name}</span>
            //     </div>
            //     <div className="iz_item-file-infos iz_flex">
            //       <span className="iz_file-percentage">
            //         0% • 30 seconds remaining
            //       </span>
            //       <a href="#" title="pause" className="iz_file-pause">
            //         <i className="fa-solid fa-pause"></i>
            //       </a>
            //       <a
            //         onClick={() => handleRemoveFile(index)}
            //         className="iz_file-remove-upload"
            //         title="Remove upload">
            //         <i className="fa-solid fa-xmark"></i>
            //       </a>
            //     </div>
            //   </div>
            //   <progress
            //       className="iz_progressBar-file"
            //       value="65"
            //       max="100"></progress>
            // </div>
            <div
              key={index}
              className="iz_item-progress-bar iz_item-file iz_item-file-downloaded">
              <div className="iz_flex iz_item-file-details">
                <div className="iz_item-file-name">
                  <span>{preview.name}</span>{" "}
                  <span className="iz_item-file-size">
                    {formatFileSize(preview.size)}
                  </span>
                </div>
                <div className="iz_item-file-infos iz_flex">
                  <a
                    onClick={() => window.open(preview.url, "_blank")}
                    className="iz_item-file-preview"
                    href="#">
                    {t("addDocument.preview")}
                  </a>
                  <a
                    onClick={() => handleRemoveFile(index)}
                    className="iz_file-delete-upload iz_text-error"
                    title="Remove upload"></a>
                </div>
              </div>
            </div>
          ))}

          {/* <div className="iz_item-progress-bar iz_item-file ">
            <div className="iz_flex iz_item-file-details">
              <div className="iz_item-file-name">
                <span>invoice assets.png</span>
              </div>
              <div className="iz_item-file-infos iz_flex">
                <span className="iz_file-percentage">
                  65% • 30 seconds remaining
                </span>
                <a href="#" title="pause" className="iz_file-pause">
                  <i className="fa-solid fa-pause"></i>
                </a>
                <a
                  href="#"
                  className="iz_file-remove-upload"
                  title="Remove upload">
                  <i className="fa-solid fa-xmark"></i>
                </a>
              </div>
            </div>
            <progress
              className="iz_progressBar-file"
              value="30"
              max="100"></progress>
          </div>

          <div className="iz_item-progress-bar iz_item-file ">
            <div className="iz_flex iz_item-file-details">
              <div className="iz_item-file-name">
                <span>invoice assets.png</span>
              </div>
              <div className="iz_item-file-infos iz_flex">
                <span className="iz_file-percentage">
                  65% • 30 seconds remaining
                </span>
                <a href="#" title="pause" className="iz_file-play">
                  <i className="fa-solid fa-play"></i>
                </a>
                <a
                  href="#"
                  className="iz_file-remove-upload"
                  title="Remove upload">
                  <i className="fa-solid fa-xmark"></i>
                </a>
              </div>
            </div>
            <progress
              className="iz_progressBar-file"
              value="70"
              max="100"></progress>
          </div> */}

          {/* <div className="iz_item-progress-bar iz_item-file iz_item-file-downloaded">
            <div className="iz_flex iz_item-file-details">
              <div className="iz_item-file-name">
                <span>invoice assets.png</span>{" "}
                <span className="iz_item-file-size">6.5 MB</span>
              </div>
              <div className="iz_item-file-infos iz_flex">
                <a className="iz_item-file-preview" href="#">
                  Preview
                </a>
                <a
                  href="#"
                  className="iz_file-delete-upload iz_text-error"
                  title="Remove upload"></a>
              </div>
            </div>
          </div> */}
          {/* 
          <div className="iz_item-progress-bar iz_item-file iz_item-file-downloaded">
            <div className="iz_flex iz_item-file-details">
              <div className="iz_item-file-name">
                <span>invoice assets.png</span>{" "}
                <span className="iz_item-file-size">6.5 MB</span>
              </div>
              <div className="iz_item-file-infos iz_flex">
                <a className="iz_item-file-preview" href="#">
                  Preview
                </a>
                <a
                  href="#"
                  className="iz_file-delete-upload iz_text-error"
                  title="Remove upload"></a>
              </div>
            </div>
          </div> */}
        </div>

        <div className="iz_btns-actions iz_flex iz_position-relative">
          <button
            onClick={() => navigate(`/folders/${folderId}`)}
            className="iz_btn iz_btn-submit iz_btn-white"
            type="reset">
            {tCore("button.cancel")}
          </button>
          <button
            disabled={loading}
            className={`iz_btn iz_btn-submit iz_btn-primary ${
              loading && "iz_btn-disabled"
            }`}
            type="submit">
            {loading ? (
              <Loader label={tCore("loading")} />
            ) : (
              tCore("button.submit")
            )}
            {/* Next */}
          </button>
        </div>
      </form>
    </>
  );
};

export default DocumentForm;
