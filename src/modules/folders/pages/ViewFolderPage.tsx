// // src/pages/folder/ViewFolderPage.jsx
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import "./ViewFolderPage.css";
// import Folder from "../FolderModel";
// import FolderService from "../FolderService";

// function ViewFolderPage() {
//   const { t } = useTranslation();
//   const { folderId } = useParams();
//   const [folder, setFolder] = useState<Folder | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFolder = async () => {
//       try {
//         const fetchedFolder = await FolderService.getFolderById(+folderId!);
//         setFolder(fetchedFolder);
//         setLoading(false);
//         navigate(`/folders/${folderId}`);
//       } catch (err) {
//         setError(t("folder.api_messages.generic_error"));
//         setLoading(false);
//       }
//     };
//     fetchFolder();
//     // eslint-disable-next-line
//   }, [folderId, navigate]);

//   if (loading) {
//     return <p>{t("folder.Loading...")}</p>;
//   }
//   if (error) {
//     return <p>{error}</p>;
//   }

//   if (!folder) {
//     return <p>{t("folder.FOLDER_NOT_FOUND")}</p>;
//   }

//   return (
//     // <AppLayout>
//     <div className="view-folder-page">
//       <div className="view-folder-header">
//         <h2>
//           {t("folder.ConsultingFolder")} : {folder.name}
//         </h2>
//       </div>
//       <div className="view-folder-content">
//         {/* Contenu de la page */}
//         <p>Nom : {folder.name}</p>
//         <p>Email de reception : {folder.reception_email}</p>
//         <p>Type de document : {t(`folder.${folder.document_type}`)}</p>
//         <p>Durée de rétention : {folder.retention_duration} jours</p>
//         <p>Statut : {t(`folder.${folder.status}`)}</p>
//       </div>
//     </div>
//     // </AppLayout>
//   );
// }
// export default ViewFolderPage;
