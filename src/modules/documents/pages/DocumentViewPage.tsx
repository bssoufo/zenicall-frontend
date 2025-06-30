// src/pages/Documents/DocumentViewPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AppEnv } from "../../../config/AppEnv";
import DocumentService from "../services/DocumentService.ts";
import { BackendDocument } from "../models/DocumentModel.ts"; // Import BackendDocument
import ConfirmationDialog from "../../../@zenidata/components/ConfirmationDialog";
import Loader, { LoadingScreen } from "../../../@zenidata/components/UI/Loader";

import FileEditor from "../components/FileEditor";
import UserHello from "../../auth/components/UserHello";
import CustomSelect from "../../../@zenidata/components/CustomSelect";
import { debounce } from "lodash";
import DocumentFormFactory from "../components/DataForm/DocumentFormFactory.tsx";
import { toast } from "react-hot-toast"; // Import toast

function DocumentViewPage() {
  const { t } = useTranslation("documents");

  const { docId } = useParams<{ docId: string }>();
  const [document, setDocument] = useState<BackendDocument | null>(null); // Use BackendDocument
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false); // Loading state for saving name

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const doc = await DocumentService.getDocumentById(Number(docId!)); // Get document, type-safe
        setDocument(doc);
        setDocumentName(doc.name ?? ""); // Initialize document name for editing
      } catch (err) {
        console.error("Error loading document:", err);
        setError(t("documents.api_messages.generic_error"));
      } finally {
        setLoading(false);
      }
    };

    if (docId) {
      fetchDocument();
    }
  }, [docId, t]);

  const debouncedSave = useCallback(
    debounce(async (docId: number, updatedData: any) => {
      try {
        const updatedDoc = await DocumentService.updateDocumentCorrectedData(
          docId,
          updatedData
        );
        console.log("Document saved:", updatedDoc);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }, 500),
    []
  );

  const handleDataChange = (updatedData: any) => {
    if (!document) return;
    debouncedSave(document.id, updatedData);
  };

  // Function to handle name editing toggle
  const handleNameEditToggle = () => {
    setIsEditingName(!isEditingName);
  };

  // Function to handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentName(e.target.value);
  };

  // Function to handle saving the name
  const handleNameSave = async () => {
    if (!document) return;

    setIsSavingName(true); // Start loading
    try {
      await DocumentService.updateDocumentName(document.id, documentName);
      // Optimistically update the document name in the state
      setDocument({ ...document, name: documentName });
      setIsEditingName(false); // Close the input field
      toast.success(t("documentView.documentUpdatedSuccessfully")); // Show a success message
    } catch (error) {
      console.error("Error updating document name:", error);
      toast.error(t("documentView.documentUpdatedFailed")); // Show an error message
    } finally {
      setIsSavingName(false); // End loading, always
    }
  };

  // In DocumentViewPage component
  const handleProcessSuccess = useCallback(async () => {
    try {
      const updatedDoc = await DocumentService.getDocumentById(Number(docId!));
      setDocument(updatedDoc);
    } catch (error) {
      console.error("Error refreshing document:", error);
      toast.error(t("documentView.refreshFailed"));
    }
  }, [docId, t]);

  if (loading) {
    return (
      <div className="iz_content-block iz_content-document">
        <div className="iz_content-block-container">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (!loading && !document) {
    return (
      <div className="iz_content-block iz_content-document">
        <div className="iz_content-block-container">
          <h3>{t("documentView.documentInvalid")}</h3>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="iz_content-block iz_content-document iz_dashboard-with-under-bar-menu ">
        <div className="iz_content-block-container">
          <UserHello />

          <div className="iz_back-link">
            <Link to={`/folders/${document.folder_id}`}>
              {t("documentView.backToFolder")}
            </Link>
          </div>

          <div className="iz_doc-processing">
            <form className="" name="" action="">
              <div className="iz_doc-processing-content iz_flex iz_position-relative">
                <div className="iz_doc-processing-left">
                  <div className="iz_content-title iz_flex">
                    {isEditingName ? (
                      <>
                        <input
                          type="text"
                          value={documentName}
                          onChange={handleNameChange}
                          className="iz_title-input"
                        />
                        <button
                          type="button"
                          className="iz_btn-icon"
                          onClick={handleNameSave}
                          disabled={isSavingName} //disable the button while saving
                        >
                          {isSavingName ? (
                            <Loader size="small" />
                          ) : (
                            <i className="fa fa-save"></i>
                          )}{" "}
                          {/* Show loading indicator */}
                        </button>
                      </>
                    ) : (
                      <>
                        <h2 className="iz_title-h2">
                          {document.name ?? "-- --"}
                        </h2>
                        <button
                          type="button"
                          className="iz_btn-icon"
                          onClick={handleNameEditToggle}>
                          <i className="fa fa-edit"></i>
                        </button>
                      </>
                    )}
                  </div>

                  <div className="iz_fields iz_flex">
                    <div className="iz_field iz_field-half iz_field-select">
                      <label>{t("documentView.documentType")}</label>
                      <input
                        type="text"
                        disabled={true}
                        value={document.document_type ?? "-- --"}
                      />
                    </div>
                    <div className="iz_field iz_field-half iz_field-select">
                      <label>{t("documentView.documentFolder")}</label>
                      <input
                        type="text"
                        disabled={true}
                        value={document.folder.name ?? "-- --"}
                      />
                    </div>
                  </div>

                  <div className="iz_gallery-docs">
                    <div className="iz_gallery-img">
                      <FileEditor
                        key={document.file_url}
                        fichier={document.file_url}
                        API_BASE_URL={AppEnv.API_BASE_URL}
                      />
                    </div>
                  </div>
                </div>
                <div className="iz_doc-processing-right">
                  <div className="document-form-area">
                    {/* Pass corrected_data and onDataChange to the form */}
                    {document?.corrected_data && (
                      <DocumentFormFactory
                        documentData={document?.corrected_data}
                        documentId={document.id}
                        documentType={document.document_type ?? ""}
                        onDataChange={handleDataChange}
                        onProcessSuccess={handleProcessSuccess}
                      />
                    )}
                    {error && <p className="error">{error}</p>}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default DocumentViewPage;
