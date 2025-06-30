import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import Folder from "../../folders/FolderModel";
import DocumentService from "../../documents/services/DocumentService";
import FolderService from "../../folders/FolderService";
import DocumentList from "../../documents/components/DocumentList";
import Loader, { LoadingScreen } from "../../../@zenidata/components/UI/Loader";
import UserHello from "../../auth/components/UserHello";
import { formatDate } from "../../../@zenidata/utils";
import { Document } from "../../documents/models/DocumentModel";

function DashboardPage() {
  const { t: tCore } = useTranslation("core");
  const { t } = useTranslation("home");
  const { t: tDoc } = useTranslation("documents");

  const [loading, setLoading] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  const [folders, setFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  const [totalFolders, setTotalFolders] = useState<number>(0);
  const [loadingTotalForlder, setLoadingTotalFolders] = useState(true);
  const [processedCounter, setProcessedCounter] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
  });
  const [loadingProcessedCounter, setLoadingProcessedCounter] = useState(true);

  // const [pagination, setPagination] = useState({
  //   totalItems: 0,
  //   totalPages: 0,
  //   currentPage: 1,
  //   pageSize: 5,
  //   hasNextPage: false,
  //   hasPrevPage: false,
  // });

  // const folderId = 28;
  // const fetchFolders = useCallback(async () => {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const data = await FolderService.getFolders({
  //       search: searchTerm,
  //       status: statusFilter,
  //       page: pagination.currentPage,
  //       limit: pagination.pageSize,
  //     });
  //     console.log(data);
  //     setFolders(data.folders);
  //     setPagination(data.pagination);
  //   } catch (err) {
  //     handleAxiosError(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [
  //   searchTerm,
  //   statusFilter,
  //   pagination.currentPage,
  //   pagination.pageSize,
  //   t,
  // ]);

  const fetchLastProcessedDocuments = useCallback(
    async () => {
      setLoadingDocuments(true);
      setError("");
      try {
        DocumentService.getLastProcessedDocument().then((data) => {
          setDocuments(data);
          setLoadingDocuments(false);
        });
      } catch (err: any) {
        setError(err.message || tDoc("errors.fetchError"));
        setLoadingDocuments(false);
      } finally {
        // setLoadingDocuments(false);
      }
    },
    [
      // folderId,
      // searchTerm,
      // statusFilter,
      // pagination.currentPage,
      // pagination.pageSize,
      // t,
    ]
  );

  const fetchMostUsedFolders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      FolderService.getMostUsedFolders().then((data) => {
        console.log(data);
        setFolders(data);
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      handleAxiosError(err); // Todo: find a way to handle error correctly
    } finally {
      // setLoading(false);
    }
  }, [
    // searchTerm,
    // statusFilter,
    // pagination.currentPage,
    // pagination.pageSize,
    t,
  ]);

  const fetchUsersTotalFolders = useCallback(async () => {
    setError("");
    try {
      setLoadingTotalFolders(true);
      FolderService.getUsersTotalFolder().then((data) => {
        setTotalFolders(data);
        setLoadingTotalFolders(false);
      });
    } catch (err) {
      handleAxiosError(err); // Todo: find a way to handle error correctly
      setLoadingTotalFolders(false);
    } finally {
      // setLoading(false);
    }
  }, []);

  const fetchDocumentCount = useCallback(async () => {
    setError("");
    try {
      setLoadingProcessedCounter(true);
      DocumentService.getLastProcessedCount().then((data) => {
        const { today, thisWeek, thisMonth, thisYear } = data;

        // console.log(data);
        setProcessedCounter({
          today,
          thisWeek,
          thisMonth,
          thisYear,
        });

        setLoadingProcessedCounter(false);
      });
    } catch (err) {
      handleAxiosError(err); // Todo: find a way to handle error correctly

      setLoadingProcessedCounter(false);
    } finally {
      // setLoading(false);
    }
  }, []);

  const fetchDocumentCountPerType = useCallback(async () => {
    setError("");
    try {
      DocumentService.getDocumentCountPerType().then((data) => {
        console.log(data);
      });
    } catch (err) {
      handleAxiosError(err); // Todo: find a way to handle error correctly
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(
    () => {
      // console.log(searchTerm, pagination.currentPage, pagination.pageSize);
      fetchLastProcessedDocuments();
      fetchUsersTotalFolders();
      fetchMostUsedFolders();
      fetchDocumentCount();
      fetchDocumentCountPerType();
    },
    [
      // searchTerm, pagination.currentPage, pagination.pageSize
    ]
  );

  // const columns = [
  //   { header: "ID", accessor: "id" as const },
  //   { header: "Name", accessor: "name" as const },
  //   { header: "Document Type", accessor: "document_type" as const },
  //   { header: "Status", accessor: "status" as const },
  //   // { header: "Updated By", accessor: "updated_by" as const },
  //   // { header: "Updated At", accessor: "updated_at" as const },
  //   { header: "Reception Email", accessor: "reception_email" as const },
  //   // { header: "Retention Duration", accessor: "retention_duration" as const },
  //   // { header: "Created By", accessor: "created_by" as const },
  //   // { header: "Created At", accessor: "created_at" as const },
  // ];

  return (
    // <div>
    //   <>
    //     <div className="iz_content-numbers iz_flex">
    //       <div className="iz_content-numbers-total">
    //         <div className="iz_text iz_flex iz_position-relative">
    //           <span>Total Folders</span>
    //           <span className="iz_folder-number">25</span>
    //         </div>
    //       </div>
    //       <div className="iz_content-numbers-details iz_flex">
    //         <div className="iz_content-label-details">
    //           <span>Documents Processed</span>
    //         </div>
    //         <div className="iz_content-values-details iz_flex">
    //           <div className="iz_content-value">
    //             <span className="iz_period-name">Today</span>
    //             <span className="iz_period-value">05</span>
    //           </div>
    //           <div className="iz_content-value">
    //             <span className="iz_period-name">Week</span>
    //             <span className="iz_period-value">20</span>
    //           </div>
    //           <div className="iz_content-value">
    //             <span className="iz_period-name">Month</span>
    //             <span className="iz_period-value">25</span>
    //           </div>
    //           <div className="iz_content-value">
    //             <span className="iz_period-name">Year</span>
    //             <span className="iz_period-value">55</span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </>
    //   <h2>{t("dashboard.title")}</h2>
    //   <p>{t("dashboard.welcomeMessage")}</p>
    //   <FolderList />
    // </div>

    <>
      <div className="iz_content-block iz_content-dasboard iz_position-relative">
        <div className="iz_content-block-container">
          <UserHello />

          <div className="iz_content-numbers iz_flex ">
            <div className="iz_content-numbers-total">
              <div className="iz_text iz_flex iz_position-relative">
                <span>{t("dashboard.totalFolders")} </span>
                <span className="iz_folder-number">
                  {loadingTotalForlder ? (
                    <Loader showText={false} />
                  ) : (
                    totalFolders
                  )}
                </span>
              </div>
            </div>
            <div className="iz_content-numbers-details iz_flex">
              <div className="iz_content-label-details">
                <span>{t("dashboard.documentsProcessed")}</span>
              </div>

              {loadingTotalForlder ? (
                <Loader showText={false} />
              ) : (
                <div className="iz_content-values-details iz_flex">
                  <div className="iz_content-value">
                    <span className="iz_period-name">
                      {t("dashboard.today")}
                    </span>
                    <span className="iz_period-value">
                      {processedCounter.today}
                    </span>
                  </div>
                  <div className="iz_content-value">
                    <span className="iz_period-name">
                      {t("dashboard.week")}
                    </span>
                    <span className="iz_period-value">
                      {processedCounter.thisWeek}
                    </span>
                  </div>
                  <div className="iz_content-value">
                    <span className="iz_period-name">
                      {t("dashboard.month")}
                    </span>
                    <span className="iz_period-value">
                      {processedCounter.thisMonth}
                    </span>
                  </div>
                  <div className="iz_content-value">
                    <span className="iz_period-name">
                      {t("dashboard.year")}
                    </span>
                    <span className="iz_period-value">
                      {processedCounter.thisYear}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="iz_used-folders-block">
            <div className="iz_content-title iz_flex">
              <h2 className="iz_title-h2">{t("dashboard.mostUsedFolders")}</h2>
              <div className="iz_flex iz_content-links">
                <Link
                  to="/folders/"
                  title="View All Folders"
                  className="iz_link-blue">
                  {t("dashboard.viewAll")}{" "}
                  {/* <span className="iz_hidden-mobile">
                    {t("dashboard.folders")}
                  </span> */}
                </Link>
                <Link
                  to="/folders/create"
                  className="iz_btn iz_btn-primary iz_hidden-mobile">
                  {t("dashboard.addFolder")}
                </Link>
              </div>
            </div>
            {loading ? (
              <LoadingScreen />
            ) : (
              <div className="iz_used-folders-boxes iz_flex">
                {folders.slice(0, 3).map((folder) => (
                  <div
                    key={folder.id}
                    className="iz_folder-box iz_flex iz_position-relative">
                    <div className="iz_folder-box-content">
                      <div className="iz_folder-box-icon">
                        <i className="iz_icon-folder-box"></i>
                      </div>
                      <div className="iz_folder-box-details iz_flex">
                        <span className="iz_folder-name">{folder.name}</span>
                        <span className="iz_folder-qty">
                          {folder.document_count} {t("dashboard.documents")}{" "}
                        </span>
                        {/* <span className="iz_folder-size">-- -- mB</span> */}
                      </div>
                    </div>
                    <Link
                      to={`/folders/${folder.id}`}
                      className="iz_link-overlay"></Link>
                  </div>
                ))}
                {/* <div className="iz_folder-box iz_flex iz_position-relative">
            <div className="iz_folder-box-content">
              <div className="iz_folder-box-icon">
                <i className="iz_icon-folder-box"></i>
              </div>
              <div className="iz_folder-box-details iz_flex">
                <span className="iz_folder-name">Invoice 2024</span>
                <span className="iz_folder-qty">10 Documents </span>
                <span className="iz_folder-size">150.00 mB</span>
              </div>
            </div>
            <a className="iz_link-overlay" href="#"></a>
          </div>
          <div className="iz_folder-box iz_flex iz_position-relative">
            <div className="iz_folder-box-content">
              <div className="iz_folder-box-icon">
                <i className="iz_icon-folder-box"></i>
              </div>
              <div className="iz_folder-box-details iz_flex">
                <span className="iz_folder-name">Invoice 2023</span>
                <span className="iz_folder-qty">2 Documents </span>
                <span className="iz_folder-size">200 mB</span>
              </div>
            </div>
            <a className="iz_link-overlay" href="#"></a>
          </div> */}
              </div>
            )}
            <div className="iz_content-title iz_flex  iz_hidden-tablet-desktop">
              <div className="iz_flex iz_content-links">
                <a href="#" className="iz_btn iz_btn-primary iz_btn-add-folder">
                  {t("dashboard.addFolder")}
                </a>
              </div>
            </div>
          </div>

          <div className="iz_documents-block">
            <div className="iz_content-title iz_flex">
              <h2 className="iz_title-h2">
                {" "}
                {t("dashboard.lastProcessedDocuments")}
              </h2>
              {/* <div className="iz_flex iz_content-links">
                <Link
                  // to={`/folders/${folderId}`}
                  to={`#`}
                  title="View All Folders"
                  className="iz_link-blue">
                  View All Documents
                </Link>
              </div> */}
            </div>
            {loadingDocuments ? (
              <LoadingScreen />
            ) : (
              <div className="iz-listing-docs iz_listing-table">
                <div className="iz_hidden-tablet-desktop iz_listing-docs-content iz_listing-table-content">
                  {documents &&
                    documents.map((document, index) => (
                      <div key={index} className="iz_item-doc iz_item-table">
                        <div className="iz_item-doc-content">
                          <h3
                            style={{ wordBreak: "break-word" }}
                            className="iz_name-document iz_item-name">
                            {document.name}
                          </h3>
                          <div className="iz_fields-document iz_fields-table">
                            {/* <div className="iz_field-document iz_field-table iz_flex">
                              <span>Document type</span>
                              <span>Invoice</span>
                            </div> */}
                            <div className="iz_field-document iz_field-table iz_flex">
                              <span>{tDoc("datatable.folder")}</span>
                              <span>{document.folder_name}</span>
                            </div>
                            {/* <div className="iz_field-document iz_field-table iz_flex">
                              <span>Size</span>
                              <span>6.7 MB</span>
                            </div>
                            <div className="iz_field-document iz_field-table iz_flex">
                              <span>Format</span>
                              <span>PNG</span>
                            </div> */}
                            <div className="iz_field-document iz_field-table iz_flex">
                              <span>{tDoc("datatable.processedOn")}</span>
                              <span>
                                {formatDate(document.updated_at) ?? "-- --"}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/folders/${document.folder_id}/documents/${document.id}`}
                            title="View document"
                            className="iz_link-document iz_field-link-table">
                            {tDoc("datatable.viewDocument")}
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>

                {loadingDocuments ? (
                  <LoadingScreen />
                ) : (
                  <DocumentList data={documents} fetchData={() => null} />
                )}
                {/* <FolderList /> */}
              </div>
            )}
          </div>

          {/* <div className="iz_diagrams-block">
            <div className="iz_diagrams-block-content iz_flex">
              <div className="iz_diagram"></div>
              <div className="iz_diagram"></div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
export default DashboardPage;
