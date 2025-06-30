import { useTranslation } from "react-i18next";
import UserHello from "../../auth/components/UserHello";
import { Link, useParams } from "react-router-dom";
import DocumentForm from "../components/DocumentForm";

function UploadImportPage() {
  const { t } = useTranslation("documents");
  const { folderId } = useParams();
  // Todo: HANDLE THE CASE WHEN THERE IS NOT FOLDER ID

  return (
    // <div>
    //   <h2>{t("upload.title")}</h2>
    //   {/* Formulaire ou zone de dépôt pour l'upload de documents */}
    // </div>

    <div className="iz_content-block iz_content-upload-document iz_bg-white ">
      <div className="iz_content-block-container">
        <UserHello />

        <div className="iz_back-link">
          <Link to={`/folders/${folderId}`}>
            {t("addDocument.backToFolder")}
          </Link>
        </div>

        <div className="iz_add-document-block ">
          <div className="iz_content-title iz_flex">
            <h2 className="iz_title-h2">{t("addDocument.uploadDocument")}</h2>
            <p>{t("addDocument.uploadDocumentDescription")}</p>
          </div>
        </div>
        <div className="iz_container-form">
          {/* <form action="" name="">
            <div className="iz_box-add-doc iz_bg-white iz_box">
              <div className="iz_center">
                <div className="iz_thumb">
                  <img alt="" src="assets/img/upload.png" />
                </div>
                <span className="iz_text-drag">
                  Drag your file(s) to start uploading
                </span>
                <div className="iz_separator iz_position-relative">
                  <span>OR</span>
                </div>
                <div className="iz_field-file iz_position-relative">
                  <input type="file" />
                  <button className="iz_btn iz_btn-white">Browse files</button>
                </div>
              </div>
            </div>
            <div className="iz_flex iz_sub-box">
              <div className="iz_text-format">
                <span>Only support .jpg, .png and .pdf and zip files</span>
              </div>
              <div className="iz_capure">
                <button
                  className="iz_capture-btn iz_btn iz_light-btn"
                  type="button">
                  Capture Image
                </button>
              </div>
            </div>
            <div className="iz_doc-settings">
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
                      The document will be automatically trimmed to include only
                      the selected pages.
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
            </div>

            <div className="iz_docs-progressbar">
              <div className="iz_item-progress-bar iz_item-file ">
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
                  value="65"
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
              </div>

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
              </div>
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
              </div>
            </div>

            <div className="iz_btns-actions iz_flex iz_position-relative">
              <button
                className="iz_btn iz_btn-submit iz_btn-white"
                type="reset">
                Cancel
              </button>
              <button
                className="iz_btn iz_btn-submit iz_btn-disabled"
                type="submit">
                Next
              </button>
            </div>
          </form> */}

          <DocumentForm folderId={folderId} />
        </div>
      </div>
    </div>
  );
}
export default UploadImportPage;
