// import { useTranslation } from "react-i18next";
// import { useParams, Link, Outlet, useLocation } from "react-router-dom";
// import UserHello from "../../auth/components/UserHello";
// import { useState, useCallback, useEffect } from "react";
// import Loader from "../../../@zenidata/components/UI/Loader";
// import DocumentService from "../../documents/DocumentService";
// import Folder from "../FolderModel";
// import FolderService from "../FolderService";

// const FolderDetailsLayout = () => {
//   const { t } = useTranslation("documents");

//   const { folderId } = useParams();

//   const location = useLocation();

//   // TODO! HANDLE THE CASE WHEN FOLDER ID IS NOT A NUMEBR

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("active");

//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [folder, setFolder] = useState<Folder>();
//   const [loadingFolder, setLoadingFolder] = useState<boolean>(false);

//   const [pagination, setPagination] = useState({
//     totalItems: 0,
//     totalPages: 0,
//     currentPage: 1,
//     pageSize: 5,
//     hasNextPage: false,
//     hasPrevPage: false,
//   });

//   const fetchDocuments = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       DocumentService.getDocumentsByFolder(+folderId!, {
//         search: searchTerm,
//         status: statusFilter,
//         page: pagination.currentPage,
//         limit: pagination.pageSize,
//       }).then((data) => {
//         setDocuments(data.documents);
//         // setPagination(data.pagination);
//         setLoading(false);
//       });
//     } catch (err: any) {
//       setError(err.message || t("documents.fetchError"));
//     } finally {
//       // setLoading(false);
//     }
//   }, [
//     folderId,
//     searchTerm,
//     statusFilter,
//     pagination.currentPage,
//     pagination.pageSize,
//     t,
//   ]);

//   const fetchFolder = useCallback(async () => {
//     setLoadingFolder(true);
//     setError("");
//     try {
//       FolderService.getFolderById(+folderId!).then((data) => {
//         setFolder(data);
//         // setPagination(data.pagination);
//         setLoadingFolder(false);
//       });
//     } catch (err: any) {
//       setError(err.message || t("documents.fetchError"));
//     } finally {
//       // setLoading(false);
//     }
//   }, [
//     folderId,
//     searchTerm,
//     statusFilter,
//     pagination.currentPage,
//     pagination.pageSize,
//     t,
//   ]);

//   useEffect(
//     () => {
//       fetchFolder();
//       fetchDocuments();
//     },
//     []
//     // [searchTerm, pagination.currentPage, pagination.pageSize]4
//   );

//   const isDocumentCreatePage = /^\/folders\/\d+\/documents\/create$/.test(
//     location.pathname
//   );

//   return (
//     // <div className="document-create-page">
//     //   <h2>{t("documents.createTitle")}</h2>
//     //   <DocumentForm folderId={folderId!} />
//     // </div>

//     <>
//       <div className="iz_content-block iz_content-folder-item">
//         <div className="iz_content-block-container">

//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// };

// export default FolderDetailsLayout;
