// // src/components/Layout/Sidebar.jsx
// import {
//   faCog,
//   faComment,
//   faFile,
//   faHome,
//   faPlus,
//   faUpload,
//   faUser,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useContext } from "react";
// import { useTranslation } from "react-i18next";
// import { Link, useLocation } from "react-router-dom";

// import "./Sidebar.css";
// import { AuthContext } from "../../modules/auth/contexts/AuthContext";

// function Sidebar() {
//   const { t } = useTranslation();
//   const { isAuthenticated, user, logout, loading } = useContext(AuthContext);
//   const location = useLocation();
//   // Déterminer si on est sur la page Dashboard
//   // const isDashboardPage = location.pathname === "/";
//   // Déterminer si on est sur une page de dossier (consultation ou modification)
//   // const isFolderPage = /^\/folders\/[^/]+/.test(location.pathname);
//   // const isDocumentListPage = /^\/folders\/[^/]+\/documents$/.test(
//   //   location.pathname
//   // );

//   // Extraire l'ID du dossier depuis le chemin (si applicable)
//   const folderIdMatch = location.pathname.match(/^\/folders\/([^/]+)/);
//   const folderId = folderIdMatch ? folderIdMatch[1] : null;

//   const handleLogout = async () => {
//     await logout();
//   };

//   return (
//     <div className="sidebar">
//       {/* Transformation du h3 en un lien cliquable vers le Dashboard */}
//       <Link to="/" className="sidebar-title-link">
//         <h3 className="sidebar-title">IzenDoc</h3>
//       </Link>
//       <div className="separator"></div>
//       {/* Section 1 */}
//       <ul className="sidebar-section">
//         <li>
//           <Link to="/">
//             <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
//             {t("sidebar.dashboard")}
//           </Link>
//         </li>

//         <div className="separator"></div>

//         {/* {isDashboardPage && ( */}
//         <li>
//           <Link to="/folders/create">
//             <FontAwesomeIcon icon={faPlus} className="sidebar-icon" />
//             {t("folder.AddFolder")}
//           </Link>
//         </li>
//         {/* )} */}

//         {
//           // (isDocumentListPage || isFolderPage) && (
//           <div>
//             <li>
//               <Link to="/upload">
//                 <FontAwesomeIcon icon={faUpload} className="sidebar-icon" />
//                 {t("sidebar.uploadImport")}
//               </Link>
//             </li>
//             <li>
//               <Link to={`/folders/${folderId}`}>
//                 <FontAwesomeIcon icon={faFile} className="sidebar-icon" />
//                 {t("sidebar.documents")}
//               </Link>
//             </li>
//             <li>
//               <Link to={`/folders/edit/${folderId}`}>
//                 <FontAwesomeIcon icon={faCog} className="sidebar-icon" />
//                 {t("sidebar.settings")}
//               </Link>
//             </li>
//           </div>
//           // )
//           // (
//           // isFolderPage && (
//           //   <>
//           //     <li>
//           //       <Link to="/">
//           //         <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
//           //         {t("sidebar.dashboard")}
//           //       </Link>
//           //     </li>
//           //     <li>
//           //       <Link to="/upload">
//           //         <FontAwesomeIcon icon={faUpload} className="sidebar-icon" />
//           //         {t("sidebar.uploadImport")}
//           //       </Link>
//           //     </li>
//           //     <li>
//           //       <Link to={`/folders/${folderId}`}>
//           //         <FontAwesomeIcon icon={faFile} className="sidebar-icon" />
//           //         {t("sidebar.documents")}
//           //       </Link>
//           //     </li>
//           //     <li>
//           //       <Link to={`/folders/edit/${folderId}`}>
//           //         <FontAwesomeIcon icon={faCog} className="sidebar-icon" />
//           //         {t("sidebar.settings")}
//           //       </Link>
//           //     </li>
//           //   </>
//           // )
//           // )
//         }
//       </ul>
//       {/* Séparateur entre les sections */}
//       <div className="separator"></div>
//       {/* Section 2 */}
//       <ul className="sidebar-section">
//         <li>
//           <Link to="/contact">
//             <FontAwesomeIcon icon={faComment} className="sidebar-icon" />
//             {t("sidebar.contact")}
//           </Link>
//         </li>
//         <li>
//           <Link to="/my-account">
//             <FontAwesomeIcon icon={faUser} className="sidebar-icon" />
//             {t("sidebar.myAccount")}
//           </Link>
//         </li>
//       </ul>
//       {/* Informations Utilisateur et Bouton Logout */}
//       {isAuthenticated && user && (
//         <div className="user-info">
//           <p>Bonjour, {user.name}</p>
//           <button
//             onClick={handleLogout}
//             className="logout-button"
//             disabled={loading}>
//             {loading ? "Déconnexion..." : "Logout"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
// export default Sidebar;
