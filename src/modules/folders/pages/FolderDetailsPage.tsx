// src/pages/Documents/DocumentListPage.jsx
import { Link, useParams } from "react-router-dom";
// import "./DocumentListPage.css"; // Créez ce fichier pour les styles si nécessaire
import { useState, useCallback, useEffect, useRef } from "react";
import Loader, { LoadingScreen } from "../../../@zenidata/components/UI/Loader";
import DocumentService from "../../documents/services/DocumentService";
import {
  Document,
  BackendDocument,
  DocumentStatus,
} from "../../documents/models/DocumentModel";
import UserHello from "../../auth/components/UserHello";
import DocumentEditableList from "../../documents/components/DocumentEditableList";
import FolderService from "../FolderService";
import Folder from "../FolderModel";
import NoDataScreen from "../../../@zenidata/components/UI/NoDataScreen";
import { formatDate } from "../../../@zenidata/utils";
import { BulkAction } from "../../../@zenidata/models/Shared";
import { useGlobalModal } from "../../../@zenidata/components/GlobalModal/GlobalModal";
import { toast } from "react-hot-toast";
import {
  displayDocumentStatus,
  displayDocumentType,
} from "../../documents/helper";
import useScreenSize from "../../../@zenidata/hooks/useScreenSize";
import { displayFolderStatus } from "../helper";
import { useTranslation } from "react-i18next";
import {
  ExportDocumentType,
  ExportPayload,
  ExportPopup,
} from "../../documents/components/DataForm/ExportPopup";
import { useTableParams } from "../../../@zenidata/components/datatable/useTableParams";

function FolderDetailsPage() {
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("folders");
  const { t: tDoc } = useTranslation("documents");

  const { params, updateParams } = useTableParams<BackendDocument>();

  const { globalModal, closeModal } = useGlobalModal();
  const { isMobileScreen } = useScreenSize();

  const { folderId } = useParams();

  // TODO! HANDLE THE CASE WHEN FOLDER ID IS NOT A NUMEBR

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState(params.search);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | null>(
    params.status as DocumentStatus
  );

  // console.log(params);

  const [documents, setDocuments] = useState<BackendDocument[]>([]);
  const [folder, setFolder] = useState<Folder>();
  const [loadingFolder, setLoadingFolder] = useState<boolean>(true);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showExportPopup, setShowExportPopup] = useState(false);

  // const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  // const [processingDocumentIds, setProcessingDocumentIds] = useState<number[]>(
  //   []
  // );
  // const [processStatus, setProcessStatus] = useState<
  //   "processing" | "completed" | null
  // >(null);
  const pollingIntervalRef = useRef<any | number | null>(null);
  const [selectedDocRows, setSelectedDocRows] = useState<Document[]>([]);
  const [selectedAction, setSelectedAction] = useState<BulkAction | null>(null);
  const processingStateRef = useRef({});

  const [processingState, setProcessingState] = useState<
    Record<number, boolean>
  >({});
  const [pagination, setPagination] = useState({
    totalItems: documents.length,
    totalPages: 0,
    currentPage: params.currentPage,
    pageSize: params.pageSize,
    hasNextPage: documents.length > 5,
    hasPrevPage: false,
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof BackendDocument | null;
    direction: "asc" | "desc" | null;
  }>({
    key: params.orderBy,
    direction: params.orderDirection,
  });

  const searchInputRef = useRef(null);
  const statusSelectRef = useRef(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      DocumentService.getDocumentsByFolder(+folderId!, {
        search: searchTerm,
        status: statusFilter,
        page: pagination.currentPage,
        limit: pagination.pageSize,
        orderBy: sortConfig.key,
        direction: sortConfig.direction,
      }).then((data) => {
        // const sortedDocument = data.documents.sort(
        //   (a, b) =>
        //     new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        // );
        setDocuments(data.documents);
        setPagination(data.pagination);
        setTimeout(() => setLoading(false), 500);
        // console.log(data);
      });
    } catch (err: any) {
      setError(err.message || t("documents.fetchError"));
    } finally {
      // setLoading(false);
    }
  }, [
    folderId,
    searchTerm,
    statusFilter,
    pagination.currentPage,
    pagination.pageSize,
    sortConfig.key,
    sortConfig.direction,
    t,
  ]);

  const fetchFolder = useCallback(async () => {
    setLoadingFolder(true);
    setError("");
    try {
      FolderService.getFolderById(+folderId!).then((data) => {
        setFolder(data);
        // setPagination(data.pagination);
        setLoadingFolder(false);
      });
    } catch (err: any) {
      setError(err.message || t("documents.fetchError"));
    } finally {
      // setLoading(false);
    }
  }, [
    folderId,
    searchTerm,
    statusFilter,
    pagination.currentPage,
    pagination.pageSize,
    t,
  ]);

  useEffect(() => {
    fetchFolder();
  }, []);

  useEffect(() => {
    if (selectedDocRows.length === 0) {
      setSelectedAction(null);
    }
  }, [selectedDocRows]);

  useEffect(() => {
    const { pageSize, currentPage } = pagination;
    const { key, direction } = sortConfig;

    updateParams({
      pageSize,
      currentPage,
      orderBy: key,
      orderDirection: direction,
      status: statusFilter || "",
      search: searchTerm || "",
    });
    fetchDocuments();
  }, [
    pagination.currentPage,
    pagination.pageSize,
    searchTerm,
    statusFilter,
    sortConfig.key,
    sortConfig.direction,
  ]);

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.value = params.search;
    if (statusSelectRef.current) statusSelectRef.current.value = params.status;
  }, [params.search, params.status]);

  const processDocuments = async (documentIds: number[]) => {
    try {
      setProcessingState((prev) => {
        const updatedState = { ...prev };
        documentIds.forEach((id) => {
          updatedState[id] = true;
        });
        // console.log("uuu", updatedState);
        return updatedState;
      });

      await DocumentService.processDocuments(documentIds);
      startPolling(documentIds);
    } catch (err) {
      setError("Erreur lors du traitement des documents.");
    }
  };

  const startPolling = (documentIds) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const { documents: statusUpdates } =
          await DocumentService.getProcessingStatus(documentIds);

        setDocuments((prevDocs) =>
          prevDocs.map((doc) => {
            const updatedDoc = statusUpdates.find(
              (statusDoc) => statusDoc.id === doc.id
            );
            return updatedDoc ? { ...doc, status: updatedDoc.status } : doc;
          })
        );

        // Mise à jour de processingState
        setProcessingState((prevState) => {
          const updatedState = { ...prevState };
          statusUpdates.forEach((doc) => {
            if (["processed", "completed", "failed"].includes(doc.status)) {
              delete updatedState[doc.id];

              // const processingDocument = documents.find(
              //   (document) => document.id === doc.id
              // );
              // if (doc.status === "failed")
              //   toast.error(
              //     `The processing failed: ${processingDocument?.name}`
              //   );
              // const processedDocument = documents.find(
              //   (document) => document.id === doc.id
              // );
              // toast.success(
              //   `document ${processedDocument.name}... Process successfully`
              // );
            }
          });
          return updatedState;
        });

        // console.log(
        //   "ProcessingState dans startPolling :",
        //   processingStateRef.current
        // );

        // Arrêter le polling si tous les documents sont traités
        if (Object.keys(processingStateRef.current).length === 0) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          // fetchDocuments();
        }
      } catch (err) {
        setError("Erreur lors de la mise à jour du statut.");
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }, 5000);
  };

  useEffect(() => {
    processingStateRef.current = processingState;
  }, [processingState]);

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleSelectedRows = (rows) => {
    // console.log("Lignes sélectionnées :", rows);
    setSelectedDocRows(rows);
  };

  const handleSearchInputChange = (e) => {
    if (searchTimeout) {
      clearInterval(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setSearchTerm(e.target.value);
      // console.log(e.target.value);
    }, 1000);

    setSearchTimeout(timeout);
  };

  const handleSelectInputChange = (e) => {
    // console.log("Status Filter: ", e.target.value);
    setPagination((prev) => ({
      ...prev,
      // currentPage: 1,
    }));
    setStatusFilter(e.target.value);
    // console.log(e.target.value);
  };

  const handleActionSelectChange = (e) => {
    setSelectedAction(e.target.value);
  };

  const handleBulkAction = () => {
    if (selectedDocRows.length === 0 || !selectedAction) return;

    const rowsIds = selectedDocRows.map((row) => row.id);

    switch (selectedAction) {
      case "process":
        processDocuments(rowsIds);
        break;
      case "export":
        setShowExportPopup(true);
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter(null);
    setSortConfig({
      key: "created_at",
      direction: "desc",
    });

    setPagination({
      totalItems: documents.length,
      totalPages: 0,
      currentPage: 1,
      pageSize: 20,
      hasNextPage: documents.length > 5,
      hasPrevPage: false,
    });

    searchInputRef.current.value = null;
    statusSelectRef.current.value = "";

    updateParams({});
  };

  const handleDeleteDocument = (row: BackendDocument) => {
    // console.log(row);

    const cancelButton = (
      <button onClick={() => closeModal()} className="iz_btn iz_btn-primary">
        {tCore("button.cancel")}
      </button>
    );
    const SubmitButton = (
      <button
        onClick={() => {
          const toastId = toast.loading(tCore("deleting"));
          closeModal();
          DocumentService.deleteDocument(row.id).then((res) => {
            // console.log("Delete res: ", res);
            toast.dismiss(toastId);
            toast.success(tCore("deletedSuccessfully"));

            // setDocuments((prev) => prev.filter((doc) => doc.id !== row.id));
            fetchDocuments();
          });
        }}
        className="iz_btn iz_btn-error">
        {tCore("button.confirm")}
      </button>
    );
    globalModal(
      tCore("deleteModal.title"),
      <>
        <p>
          {tCore("deleteModal.description")}
          <br />
          <span className="iz_text-primary">{row.name}</span>
        </p>
      </>,
      [SubmitButton, cancelButton]
    );
  };

  const handleSort = (column: keyof BackendDocument) => {
    if (!sortConfig) return;
    setSortConfig((prev) => ({
      key: prev.key === column ? column : column,
      direction:
        prev.key === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleExport = async (payload: ExportPayload) => {
    try {
      const response = await DocumentService.exportDocuments(payload);
      const extension = payload.format === "csv" ? "csv" : "xlsx";
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `export-${Date.now()}.${extension}`;
      link.click();

      toast.success(t("documentView.exportSuccess"));
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(t("documentView.exportError"));
    }
  };

  // if (loading)
  //   return (
  //     <div className="iz_content-block">
  //       <LoadingScreen />
  //     </div>
  //   );

  return (
    // <div className="document-list-page">
    //   {/* {!loading && documents.length === 0 ? (
    //     <p>Aucun document</p>
    //   ) : (
    //     <DocumentList data={documents} fetchData={fetchDocuments} />
    //   )} */}

    //   <DocumentList data={documents} fetchData={fetchDocuments} />
    // </div>

    <>
      <div className="iz_content-block iz_content-folder-item iz_content-folder-documents">
        <div className="iz_content-block-container">
          <div className="iz_folder-creation-block iz_folder-details-block">
            <UserHello />

            <div className="iz_back-link">
              <Link to="/folders">{t("folderDetails.backToFolder")}</Link>
            </div>

            <div className="iz_folder-creation-block iz_folder-details-block">
              <div className="iz_content-title iz_flex">
                <h2 className="iz_title-h2">
                  {t("folderDetails.folderDetails")}
                </h2>
              </div>
              <div className="iz_box iz_box-details iz_bg-white">
                {loadingFolder ? (
                  <Loader />
                ) : (
                  <>
                    {folder && (
                      <>
                        <div className="iz_box-row iz_flex">
                          <div className="iz_folder-name">
                            <span> {t("folderDetails.folderName")}:</span>{" "}
                            <span>{folder?.name ?? "-- --"}</span>
                          </div>
                          <div className="iz_box-d iz_flex">
                            <div>
                              <span>{t("folderDetails.documentType")} :</span>{" "}
                              <span>
                                {folder?.document_type
                                  ? displayDocumentType(
                                      folder?.document_type,
                                      t(`folderDetails.${folder.document_type}`)
                                    )
                                  : "-- --"}
                              </span>
                            </div>
                            <div>
                              <span>{t("folderDetails.folderStatus")} : </span>{" "}
                              {/* <span
                                className={
                                  folder.status === "active"
                                    ? "iz_text-success "
                                    : "iz_text-error"
                                }>
                                Folder{" "}
                                {folder.status === "active"
                                  ? "Active"
                                  : "Inactive"}
                              </span> */}
                              {displayFolderStatus(
                                folder.status,
                                tCore(folder.status)
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="iz_box-row iz_flex">
                          {/* <div className="iz_folder-retention">
                            <span>Reception email :</span>{" "}
                            <span>{folder?.reception_email ?? "-- --"}</span>
                          </div> */}
                          <div className="iz_box-d iz_flex">
                            <div>
                              <span>{t("folderDetails.createdOn")}:</span>{" "}
                              <span>
                                {formatDate(folder?.created_at) ?? "-- --"}
                              </span>
                            </div>
                            {/* <div>
                              <span>Extraction Language : </span>{" "}
                              <span>{folder?.language ?? "-- --"}</span>
                            </div> */}
                          </div>
                        </div>
                        {/* <div className="iz_box-row iz_flex iz_box-description">
                          <span>Description :</span>
                          <div className="iz_box-description-text">
                            {folder.description ?? "-- --"}
                          </div>
                        </div> */}
                      </>
                    )}
                    {/* Error goes here */}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="iz_documents-block">
            <div className="iz_content-title iz_flex">
              <h2 className="iz_title-h2">
                {t("folderDetails.documents")}
                {!loading &&
                  pagination?.totalItems > 0 &&
                  `(${pagination?.totalItems})`}
              </h2>
              {/* {!loading && (documents.length > 0 || !!searchTerm) && ( */}
              <div className="iz_flex iz_content-links">
                <form className="" action="">
                  <div className="iz_fields iz_flex">
                    <div
                      style={{ display: "flex", flexWrap: "nowrap" }}
                      className="iz_field iz_field-select iz_flex">
                      <label className="iz_hidden-mobile">
                        {t("folderDetails.status")}
                      </label>
                      <select
                        defaultValue="active"
                        ref={statusSelectRef}
                        style={{ marginLeft: "1rem" }}
                        disabled={loading}
                        onChange={(e) => handleSelectInputChange(e)}>
                        <option value="">
                          {t("folderDetails.statusOptionAll")}
                        </option>
                        <option value="processed">
                          {t("folderDetails.statusOptionProcessed")}
                        </option>
                        <option value="pending">
                          {t("folderDetails.statusOptionPending")}
                        </option>
                        <option value="failed">
                          {t("folderDetails.statusOptionFailed")}
                        </option>
                      </select>
                    </div>
                    <div className="iz_field iz_field-search">
                      <input
                        value={searchInputRef?.current?.value}
                        ref={searchInputRef}
                        type="search"
                        placeholder={t("folderDetails.searchInputPlaceholder")}
                        onChange={handleSearchInputChange}
                      />
                    </div>
                  </div>
                </form>

                <div>
                  <button
                    type="button"
                    style={{ marginRight: "0.5rem" }}
                    onClick={handleReset}
                    title=""
                    className={`${
                      loading && ""
                    } iz_btn iz_btn-white iz_btn-white-2 iz_hidden-mobile`}>
                    {t("folderDetails.reset")}
                  </button>
                  <select
                    onChange={handleActionSelectChange}
                    disabled={loading || selectedDocRows.length === 0}
                    value={selectedAction || ""}>
                    <option value="" disabled>
                      {tCore("selectAction")}
                    </option>
                    <option value="process">
                      {t("folderDetails.process")}
                    </option>
                    <option value="export">{t("folderDetails.export")}</option>
                  </select>
                </div>

                <button
                  onClick={handleBulkAction}
                  title=""
                  className={`${
                    loading && ""
                  } iz_btn iz_btn-white iz_btn-white-2 iz_hidden-mobile`}>
                  {t("folderDetails.bulkAction")}
                </button>
                <Link
                  to={`/folders/${folderId}/documents/create`}
                  title="Add document"
                  className="iz_btn iz_btn-primary">
                  {t("folderDetails.addDocument")}
                </Link>
              </div>
              {/* )} */}
            </div>

            <>
              {/* {(documents.length > 0 || !!searchTerm) && ( */}
              <>
                <div className="iz-listing-docs iz_listing-table">
                  <>
                    {loading && isMobileScreen && <LoadingScreen />}

                    {!loading &&
                      documents.length > 0 &&
                      documents.map((document, index) => (
                        <div
                          key={index}
                          style={{ margin: "1rem 0" }}
                          className="iz_hidden-tablet-desktop iz-listing-docs-content iz_listing-table-content">
                          <div className="iz_item-table">
                            <div className="iz_item-table-content">
                              <h3
                                style={{ wordBreak: "break-word" }}
                                className="iz_item-name">
                                {document.name}
                              </h3>
                              <div className="iz_fields-table">
                                {/* <div className="iz_field-table iz_flex">
                                <span>Document Name</span>
                                <span>invoice assets.png</span>
                              </div>
                              <div className="iz_field-table iz_flex">
                                <span>Size</span>
                                <span>6.5MB</span>
                              </div>
                              <div className="iz_field-table iz_flex">
                                <span>Format</span>
                                <span>PNG</span>
                              </div> */}
                                <div className=" iz_field-table iz_flex">
                                  <span>{tDoc("datatable.createdOn")}</span>
                                  <span>{formatDate(document.created_at)}</span>
                                </div>
                                <div className=" iz_field-table iz_flex">
                                  <span>{tDoc("datatable.status")}</span>
                                  <span className="iz_text-warning">
                                    {displayDocumentStatus(
                                      document.status,
                                      tCore(document.status)
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="iz_fields-btn-action iz_flex">
                                <a
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={() =>
                                    processDocuments([document.id])
                                  }
                                  className="iz_btn iz_btn-white-2"
                                  title="process">
                                  {processingState[document.id] && (
                                    <Loader showText={false} size="small" />
                                  )}
                                  {t("folderDetails.process")}
                                </a>
                                <Link
                                  to={`/folders/${folderId}/documents/${document.id}`}
                                  className="iz_btn-view-document iz_btn-view-item"
                                  title="Viex document"></Link>
                                {/* <a
                                href="#"
                                className="iz_folder-btn-update"
                                title="upload document"></a> */}
                                <a
                                  onClick={() => handleDeleteDocument(document)}
                                  className="iz_file-delete-upload iz_text-error"
                                  title="Remove upload"></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </>

                  {(searchTerm || statusFilter) &&
                    !loading &&
                    documents.length === 0 && <NoDataScreen />}

                  {(loading || documents.length > 0) && (
                    <DocumentEditableList
                      data={documents}
                      fetchData={fetchDocuments}
                      processingState={processingState}
                      handleProcessDocuments={processDocuments}
                      pagination={pagination}
                      setPagination={setPagination}
                      loading={loading}
                      handleSelectedRows={handleSelectedRows}
                      handleDeleteDocument={handleDeleteDocument}
                      sortConfig={sortConfig}
                      handleSort={(column: keyof BackendDocument) =>
                        handleSort(column)
                      }
                    />
                  )}
                </div>
              </>

              {!!!searchTerm &&
                !!!statusFilter &&
                !loading &&
                documents.length === 0 && (
                  <div className="iz_add-doc-folders">
                    <div className="iz_box-add-doc iz_bg-white iz_box">
                      <div className="iz_center">
                        <div className="iz_thumb">
                          <img alt="" src="/assets/img/amico.png" />
                        </div>
                        <h3>{t("folderDetails.noDocumentAddedYet")}</h3>
                        <p>{t("folderDetails.addDocumentDescription")}</p>
                        {/* <form>
                          <div className="iz_field-file iz_position-relative">
                            <input type="file" />
                            <button className="iz_btn iz_btn-primary">
                              Upload Document
                            </button>
                          </div>
                        </form> */}
                        <Link
                          to={`/folders/${folderId}/documents/create`}
                          title="Add document"
                          className="iz_btn iz_btn-primary">
                          {t("folderDetails.addDocument")}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

              {/* No document text goes here */}
            </>
          </div>
        </div>
      </div>
      {showExportPopup && (
        <ExportPopup
          documentIds={selectedDocRows.map((doc) => doc.id)}
          documentType={
            folder?.document_type?.toLowerCase() as ExportDocumentType
          } // Convert to lowercase
          onClose={() => setShowExportPopup(false)}
          onExport={handleExport}
        />
      )}
    </>
  );
}
export default FolderDetailsPage;
