// // src/pages/Documents/DocumentCreatePage.jsx
// import { Link, useParams } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import DocumentForm from "../components/DocumentForm";
// import UserHello from "../../auth/components/UserHello";

// function DocumentCreatePage() {
//   // const { folderId } = useParams();
//   // const { t } = useTranslation("documents");

//   return (
//     // <div className="document-create-page">
//     //   <h2>{t("documents.createTitle")}</h2>
//     //   <DocumentForm folderId={folderId!} />
//     // </div>

//     <>
//       {/* <div className="iz_content-block iz_content-folder-item">
//         <div className="iz_content-block-container">
//           <UserHello />

//           <div className="iz_back-link">
//             <Link to={`/folders/${folderId}`}>Back to folder</Link>
//           </div>

//           <div className="iz_folder-creation-block iz_folder-details-block">
//             <div className="iz_content-title iz_flex">
//               <h2 className="iz_title-h2">Folder Details </h2>
//               <div className="iz_flex iz_content-links">
//                 <span className="iz_text-error">Archive Folder</span>
//                 <a href="#" className="iz_folder-btn-update"></a>
//                 <a href="#" className="iz_folder-btn-delele iz_text-error">
//                   <i className="fa-solid fa-trash-can"></i>
//                 </a>
//               </div>
//             </div>
//             <div className="iz_box iz_box-details iz_bg-white">
//               <div className="iz_box-row iz_flex">
//                 <div className="iz_folder-name">
//                   <span>Folder Name :</span> <span>Invoice 2025</span>
//                 </div>
//                 <div className="iz_box-d iz_flex">
//                   <div>
//                     <span>Retention Duration :</span> <span>30</span>
//                   </div>
//                   <div>
//                     <span>Folder Status : </span>{" "}
//                     <span className="iz_text-success">Folder Active</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="iz_box-row iz_flex">
//                 <div className="iz_folder-retention">
//                   <span>Reception email :</span> <span>genz@gmail.com</span>
//                 </div>
//                 <div className="iz_box-d iz_flex">
//                   <div>
//                     <span>Created On :</span> <span>08-06-2024</span>
//                   </div>
//                   <div>
//                     <span>Extraction Language : </span> <span>English</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="iz_box-row iz_flex iz_box-description">
//                 <span>Description :</span>
//                 <div className="iz_box-description-text">
//                   Figma ipsum component variant main layer. Vector subtract
//                   bullet team edit vertical export image comment. Flatten
//                   follower mask prototype style select arrow slice. Figma ipsum
//                   component variant main layer. Vector subtract bullet team edit
//                   vertical export image comment. Flatten follower mask prototype
//                   style select arrow slice.
//                 </div>
//               </div>
//             </div>

//             <div className="iz_add-doc-folders">
//               <h2>Documents</h2>
//               <div className="iz_box-add-doc iz_bg-white iz_box">
//                 <div className="iz_center">
//                   <div className="iz_thumb">
//                     <img alt="" src="assets/img/amico.png" />
//                   </div>
//                   <h3>No Documents Added Yet</h3>
//                   <p>
//                     Upload documents to enable data extraction and start
//                     processing. Once added, you’ll see them listed here.
//                   </p>
//                   <form>
//                     <div className="iz_field-file iz_position-relative">
//                       <input type="file" />
//                       <button className="iz_btn iz_btn-primary">
//                         Upload Document
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div> */}

//       <div className="iz_add-doc-folders">
//         <h2>Documents</h2>
//         <div className="iz_box-add-doc iz_bg-white iz_box">
//           <div className="iz_center">
//             <div className="iz_thumb">
//               <img alt="" src="assets/img/amico.png" />
//             </div>
//             <h3>No Documents Added Yet</h3>
//             <p>
//               Upload documents to enable data extraction and start processing.
//               Once added, you’ll see them listed here.
//             </p>
//             <form>
//               <div className="iz_field-file iz_position-relative">
//                 <input type="file" />
//                 <button className="iz_btn iz_btn-primary">
//                   Upload Document
//                   {/* {t("Submit")} */}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// export default DocumentCreatePage;
