// // src/components/Documents/DocumentList.tsx
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Link, useNavigate } from "react-router-dom";

// import "./DocumentList.css";
// import DocumentService from "../DocumentService";
// import ConfirmationDialog from "../../../@zenidata/components/ConfirmationDialog";
// import PaginatedList from "../../../@zenidata/components/UI/PaginatedList";

// interface Document {
//   id: string;
//   name: string;
//   created_at: string | null;
//   status: string;
// }

// interface Pagination {
//   totalItems: number;
//   totalPages: number;
//   currentPage: number;
//   pageSize: number;
//   hasNextPage: boolean;
//   hasPrevPage: boolean;
// }

// interface DocumentListProps {
//   folderId: string;
// }

// const DocumentList: React.FC<DocumentListProps> = ({ folderId }) => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [pagination, setPagination] = useState<Pagination>({
//     totalItems: 0,
//     totalPages: 0,
//     currentPage: 1,
//     pageSize: 10,
//     hasNextPage: false,
//     hasPrevPage: false,
//   });
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [statusFilter, setStatusFilter] = useState<string>("pending");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
//   const [processing, setProcessing] = useState<boolean>(false);
//   // @ts-ignore
//   const [processStatus, setProcessStatus] = useState<
//     "processing" | "completed" | null
//   >(null);
//   const pollingIntervalRef = useRef<any | number | null>(null);

//   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
//   const [dialogTitle, setDialogTitle] = useState<string>("");
//   const [dialogMessage, setDialogMessage] = useState<string>("");
//   const [dialogConfirmAction, setDialogConfirmAction] = useState<() => void>(
//     () => {}
//   );
//   const [dialogCancelAction, setDialogCancelAction] = useState<() => void>(
//     () => {}
//   );

//   const fetchDocuments = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const data = await DocumentService.getDocumentsByFolder(+folderId, {
//         search: searchTerm,
//         status: statusFilter,
//         page: pagination.currentPage,
//         limit: pagination.pageSize,
//       });
//       setDocuments(data.documents);
//       setPagination(data.pagination);
//     } catch (err: any) {
//       setError(err.message || t("documents.fetchError"));
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     folderId,
//     searchTerm,
//     statusFilter,
//     pagination.currentPage,
//     pagination.pageSize,
//     t,
//   ]);

//   useEffect(() => {
//     fetchDocuments();
//   }, [fetchDocuments]);

//   const handleSearchChange = (term: string) => {
//     setSearchTerm(term);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleStatusChange = (status: string) => {
//     setStatusFilter(status);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handlePageChange = (pageNumber: number) => {
//     setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
//   };

//   const toggleSelectDocument = (documentId: string) => {
//     setSelectedDocuments((prevSelected) =>
//       prevSelected.includes(documentId)
//         ? prevSelected.filter((id) => id !== documentId)
//         : [...prevSelected, documentId]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selectedDocuments.length === documents.length) {
//       setSelectedDocuments([]);
//     } else {
//       setSelectedDocuments(documents.map((doc) => doc.id));
//     }
//   };

//   const handleProcessDocuments = () => {
//     if (selectedDocuments.length === 0) {
//       setError(t("documents.selectAtLeastOne"));
//       return;
//     }
//     const alreadyProcessed = documents.filter(
//       (doc) => selectedDocuments.includes(doc.id) && doc.status === "processed"
//     );
//     if (alreadyProcessed.length > 0) {
//       setDialogTitle(t("documents.dialogs.processTitle"));
//       setDialogMessage(t("documents.dialogs.processMessage"));
//       setDialogConfirmAction(() => confirmProcessDocuments);
//       setDialogCancelAction(() => closeDialog);
//       setIsDialogOpen(true);
//     } else {
//       processDocuments();
//     }
//   };

//   const confirmProcessDocuments = () => {
//     processDocuments();
//     setIsDialogOpen(false);
//   };

//   const closeDialog = () => {
//     setIsDialogOpen(false);
//   };

//   const processDocuments = async () => {
//     try {
//       setProcessing(true);
//       setProcessStatus("processing");
//       setError("");
//       await DocumentService.processDocuments(selectedDocuments);
//       startPolling(selectedDocuments);
//     } catch (err: any) {
//       setError(err.message);
//       setProcessing(false);
//       setProcessStatus(null);
//     }
//   };

//   const startPolling = (selectedDocuments: string[]) => {
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//     }
//     pollingIntervalRef.current = setInterval(async () => {
//       try {
//         const statusData = await DocumentService.getProcessingStatus(
//           selectedDocuments
//         );
//         const { documents: docStatuses } = statusData;

//         setDocuments((prevDocs) =>
//           prevDocs.map((doc) => {
//             const updatedDoc = docStatuses.find(
//               (statusDoc: any) => statusDoc.id === doc.id
//             );
//             return updatedDoc ? { ...doc, status: updatedDoc.status } : doc;
//           })
//         );

//         const allStatusesFinal = docStatuses.every((doc: any) =>
//           ["processed", "completed", "failed"].includes(doc.status)
//         );

//         if (allStatusesFinal) {
//           clearInterval(pollingIntervalRef.current!);
//           pollingIntervalRef.current = null;
//           setProcessing(false);
//           setProcessStatus("completed");
//           setSelectedDocuments([]);
//           fetchDocuments();
//         }
//       } catch (err) {
//         setError(t("documents.pollingError"));
//         clearInterval(pollingIntervalRef.current!);
//         pollingIntervalRef.current = null;
//         setProcessing(false);
//         setProcessStatus(null);
//       }
//     }, 5000);
//   };

//   useEffect(() => {
//     return () => {
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current);
//       }
//     };
//   }, []);

//   const renderDocumentItem = (doc: Document) => (
//     <tr key={doc.id}>
//       <td>
//         <input
//           type="checkbox"
//           aria-label={`Sélectionner le document ${doc.name}`}
//           checked={selectedDocuments.includes(doc.id)}
//           onChange={() => toggleSelectDocument(doc.id)}
//         />
//       </td>
//       <td>{doc.name || "N/A"}</td>
//       <td>
//         {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "N/A"}
//       </td>
//       <td>{t(`documents.status.${doc.status}`)}</td>
//       <td>
//         <Link to={`/folders/${folderId}/${doc.id}`} className="view-button">
//           {t("documents.view")}
//         </Link>
//         <Link to={`/documents/${doc.id}/edit`} className="edit-button">
//           {t("documents.edit")}
//         </Link>
//       </td>
//     </tr>
//   );

//   const renderTableHeader = () => (
//     <tr>
//       <th>
//         <input
//           type="checkbox"
//           aria-label="Sélectionner tous les documents"
//           checked={
//             selectedDocuments.length === documents.length &&
//             documents.length > 0
//           }
//           onChange={toggleSelectAll}
//         />
//       </th>
//       <th>{t("documents.fields.name")}</th>
//       <th>{t("documents.fields.creationDate")}</th>
//       <th>{t("documents.fields.status")}</th>
//       <th>{t("documents.fields.actions")}</th>
//     </tr>
//   );

//   return (
//     <div className="document-list">
//       <div className="document-list-header">
//         <h2>{t("documents.listTitle")}</h2>
//         <button
//           className="add-button"
//           onClick={() => navigate(`/folders/${folderId}/create`)}
//           disabled={processing}
//           aria-disabled={processing}>
//           {t("documents.add")}
//         </button>
//       </div>
//       <div className="document-list-controls">
//         <div className="status-filter">
//           <label htmlFor="statusFilter">
//             {t("documents.fields.filterByStatus")}:
//           </label>
//           <select
//             id="statusFilter"
//             name="statusFilter"
//             value={statusFilter}
//             onChange={(e) => handleStatusChange(e.target.value)}
//             disabled={processing}
//             aria-disabled={processing}>
//             <option value="all">{t("documents.status.all")}</option>
//             <option value="pending">{t("documents.status.pending")}</option>
//             <option value="processed">{t("documents.status.processed")}</option>
//             <option value="archived">{t("documents.status.archived")}</option>
//           </select>
//         </div>
//         <button
//           className="process-button"
//           onClick={handleProcessDocuments}
//           disabled={processing || selectedDocuments.length === 0}
//           aria-disabled={processing || selectedDocuments.length === 0}>
//           {processing ? (
//             <>
//               <FontAwesomeIcon icon="spinner" spin className="spinner" />{" "}
//               {t("documents.processing")}
//             </>
//           ) : (
//             t("documents.process")
//           )}
//         </button>
//       </div>
//       {processing && (
//         <div className="processing-indicator">
//           <FontAwesomeIcon
//             icon="spinner"
//             spin
//             className="spinner large-spinner"
//           />
//           {t("documents.processingDocuments")}
//         </div>
//       )}
//       {error && (
//         <div className="error-message" role="alert">
//           {error}
//         </div>
//       )}
//       <PaginatedList
//         // folderId={folderId}
//         // itemsPerPage={pagination.pageSize}
//         // searchFields={["name", "status", "file"]}
//         onSearchChange={handleSearchChange}
//         onFilterChange={handleStatusChange}
//         onPageChange={handlePageChange}
//         searchPlaceholder={
//           t("documents.fields.searchPlaceholder") || "Rechercher..."
//         }
//         documents={documents}
//         pagination={pagination}
//         renderTableHeader={renderTableHeader}
//         renderTableBody={renderDocumentItem}
//         loading={loading}
//         error={error}
//       />
//       <ConfirmationDialog
//         isOpen={isDialogOpen}
//         title={dialogTitle}
//         message={dialogMessage}
//         onConfirm={dialogConfirmAction}
//         onCancel={dialogCancelAction}
//         confirmText={t("documents.dialogs.confirm")}
//         cancelText={t("documents.dialogs.cancel")}
//       />
//     </div>
//   );
// };

// export default DocumentList;
