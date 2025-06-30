// src/pages/AddFolderPage.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
// import AddFolderForm from "../../components/UI/Folder/add_folder/AddFolderForm";
// import styles from "./AddFolderPage.module.css"; // Import du fichier CSS
import FolderService from "../FolderService";
import AddFolderForm from "../components/AddFolderForm";
import UserHello from "../../auth/components/UserHello";

function AddFolderPage() {
  const { t } = useTranslation("folders");
  const { id } = useParams(); // Récupérer l'ID du dossier depuis l'URL
  const [initialFolder, setInitialFolder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFolder = async () => {
      if (id) {
        try {
          const folder = await FolderService.getFolderById(+id);
          setInitialFolder(folder);
        } catch (err) {
          alert(t("folder.api_messages.generic_error"));
        }
      }
      setLoading(false);
    };
    fetchFolder();
    // eslint-disable-next-line
  }, [id]);

  console.log(initialFolder);

  return (
    // <div className="add-folder-page-container">
    //   <h1>{id ? t("folder.EditFolder") : t("folder.AddFolder")}</h1>
    //   {loading ? (
    //     <Loader label={t("folder.Loading...")} />
    //   ) : (
    // <AddFolderForm initialFolder={initialFolder} />
    //   )}
    // </div>

    <>
      {/* <div className="iz_folder-creation-block iz_bg-white">
        <div className="iz_content-title iz_flex">
          <h2 className="iz_title-h2">Add new folder</h2>
        </div>

        <div className="iz_create-folder iz_container-form">
          <AddFolderForm initialFolder={initialFolder} />
        </div>
      </div> */}

      <div className="iz_content-block iz_content-folder iz_bg-white">
        <div className="iz_content-block-container">
          <UserHello />

          <div className="iz_back-link">
            <Link to="/folders">{t("addFolder.backToFolder")}</Link>
          </div>

          <div className="iz_folder-creation-block">
            <div className="iz_content-title iz_flex">
              <h2 className="iz_title-h2">{t("addFolder.addNewFolder")}</h2>
            </div>

            <div className="iz_create-folder iz_container-form">
              <AddFolderForm initialFolder={initialFolder} />
              {/* <form>
                <div className="iz_fields iz_flex">
                  <div className="iz_field iz_field-half iz_field-has-limit-text">
                    <label>
                      Folder name <sup>*</sup>
                    </label>
                    <input type="text" placeholder="Type folder name here" />
                    <span className="iz_field-limit">0/50</span>
                  </div>
                  <div className="iz_field iz_field-half">
                    <label>
                      Reception Email <sup>*</sup>
                    </label>
                    <input type="email" placeholder="eg:xyz@gmail.com" />
                  </div>
                </div>
                <div className="iz_fields iz_flex">
                  <div className="iz_field iz_field-select iz_field-half">
                    <label>
                      Document Type <sup>*</sup>
                    </label>
                    <select>
                      <option>Select document type</option>
                      <option>pdf</option>
                    </select>
                  </div>
                  <div className="iz_field iz_field-half iz_field-select">
                    <label>
                      Extraction Language <sup>*</sup>
                    </label>
                    <select>
                      <option>Select extraction language </option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
                <div className="iz_fields iz_flex">
                  <div className="iz_field iz_field-half iz_field-select">
                    <label>
                      Retention Duration (days) <sup>*</sup>
                    </label>
                    <select>
                      <option>Select document type</option>
                      <option>pdf</option>
                    </select>
                  </div>
                </div>
                <div className="iz_field iz_field-wyswyg">
                  <label>
                    Description <sup>*</sup>
                  </label>
                  <textarea></textarea>
                </div>
                <div className="iz_field  iz_field_radio">
                  <label>
                    Statut <sup>*</sup>
                  </label>
                  <div className="iz_group-radio iz_flex">
                    <div className="iz_field iz_field-radio">
                      <input
                        type="radio"
                        name="iz_field-status"
                        id="iz_active-radio"
                      />
                      <label htmlFor="iz_active-radio">Active</label>
                    </div>
                    <div className="iz_field iz_field-radio">
                      <input
                        type="radio"
                        name="iz_field-status"
                        id="iz_archive-radio"
                      />
                      <label htmlFor="iz_archive-radio">Archive</label>
                    </div>
                  </div>
                </div>

                <div className="iz_box iz_box-uplaod iz_position-relative">
                  <div className="iz_box-content">
                    <h2>Upload document</h2>
                    <p>
                      Figma ipsum component variant main layer. Vector subtract
                      bullet team edit vertical export image comment. Flatten
                      follower mask prototype style select arrow slice. Figma
                      ipsum component variant main layer. Vector subtract bullet
                      team edit vertical export image comment. Flatten follower
                      mask prototype style select arrow slice.
                    </p>
                    <div className="iz_field iz_file iz_position-relative">
                      <input type="file" value="" id="" />
                      <span className="iz_btn-primary iz_btn iz_input-file">
                        Upload Document
                      </span>
                    </div>
                  </div>
                </div>

                <div className="iz_btns-actions iz_flex iz_position-relative">
                  <button
                    className="iz_btn iz_btn-submit iz_btn-white iz_btn-white-with-grey-border"
                    type="reset">
                    Cancel
                  </button>
                  <button className="iz_btn iz_btn-disabled" type="submit">
                    Add folder
                  </button>
                </div>
              </form> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AddFolderPage;
