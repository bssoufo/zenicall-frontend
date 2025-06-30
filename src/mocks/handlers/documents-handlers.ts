// // src/mocks/documents-handlers.js

// import { http, HttpResponse } from "msw";
// import {
//   fakeFolders,
//   fakeDocuments,
//   allowedDocumentTypes,
//   generateFolderId,
//   generateDocumentId,
// } from "./data";
// import { faker } from "@faker-js/faker";
// import { v4 as uuidv4 } from "uuid"; // Import de uuid pour générer des thread_id uniques
// import Folder from "../../models/FolderModel";
// import { AppEnv } from "../../config/AppEnv";

// // Base URL de l'API
// const API_BASE_URL = AppEnv.API_BASE_URL || "http://localhost:4000";

// /**
//  * Fonction pour valider l'email (simulée)
//  * @param {string} email
//  * @returns {boolean}
//  */
// const isValidEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// // Fonction pour générer des données aléatoires pour structuredData
// const generateRandomStructuredData = () => {
//   return {
//     InvoiceIssueDate: faker.date.past({ years: 1 }).toISOString().split("T")[0],
//     InvoiceNumber: faker.number.int({ min: 1000, max: 9999 }).toString(),
//     Items: [
//       {
//         description: faker.commerce.productName(),
//         price: faker.commerce.price(),
//         quantity: faker.number.int({ min: 1, max: 10 }),
//         unitPrice: faker.commerce.price(),
//       },
//     ],
//     PaymentMethod: faker.helpers.arrayElement([
//       "Visa",
//       "MasterCard",
//       "PayPal",
//       "Bank Transfer",
//     ]),
//     ReceiptNumber: faker.number.int({ min: 1000, max: 9999 }).toString(),
//     SubtotalAmount: faker.commerce.price(),
//     TaxAmount: faker.commerce.price(),
//     TotalAmount: faker.commerce.price(),
//     VendorAddress: {
//       original: faker.location.streetAddress(),
//       found: true,
//       normalized: faker.location.streetAddress(),
//       number: faker.number.int({ min: 1, max: 9999 }).toString(),
//       street: faker.location.streetAddress(),
//       address1: faker.location.streetAddress(),
//       address2: faker.location.secondaryAddress(),
//       city: faker.location.city(),
//       zip: faker.location.zipCode(),
//       county: faker.location.county(),
//       state_code: faker.location.state({ abbreviated: true }),
//       state: faker.location.state(),
//       country_code: faker.location.countryCode(),
//       country: faker.location.country(),
//       lat: faker.location.latitude(),
//       lng: faker.location.longitude(),
//       map: `https://www.google.com/maps/search/?api=1&query=${faker.location.latitude()},${faker.location.longitude()}`,
//     },
//     VendorCompany: faker.company.name(),
//     VendorName: faker.person.fullName(),
//     VendorPhone: faker.phone.number(),
//     VendorTaxID: faker.string.uuid(),
//     OriginalDocument: {
//       name: faker.system.fileName(),
//       url: faker.internet.url(),
//       content_type: faker.system.mimeType(),
//       size: faker.number.int({ min: 1000, max: 1000000 }),
//       content_id: faker.string.uuid(),
//       is_inline: faker.datatype.boolean(),
//     },
//   };
// };

// // In-memory storage pour les processus en cours
// const processStatusMap = {};

// /**
//  * Simule le traitement asynchrone des documents en mettant à jour leur statut et structuredData.
//  * @param {string} threadId - Identifiant du processus.
//  * @param {Array<string>} documentIds - Liste des identifiants des documents à traiter.
//  */
// const simulateDocumentProcessing = (threadId, documentIds) => {
//   const totalDocuments = documentIds.length;
//   let processedCount = 0;

//   documentIds.forEach((docId) => {
//     // Simuler un délai de traitement aléatoire entre 2 et 5 secondes
//     const processingTime = faker.number.int({ min: 2000, max: 5000 });

//     setTimeout(() => {
//       const document = fakeDocuments.find((doc) => doc.id === docId);
//       if (document) {
//         // Générer des données structurées aléatoires
//         const generatedData = generateRandomStructuredData();
//         document.structuredData = generatedData;
//         document.correctedData = generatedData;
//         document.status = "processed";
//         document.updatedAt = new Date().toISOString();
//         processStatusMap[threadId].documents[docId] = "processed";
//       }
//       processedCount += 1;

//       // Si tous les documents sont traités, mettre à jour le statut du processus
//       if (processedCount === totalDocuments) {
//         processStatusMap[threadId].status = "completed";
//       }
//     }, processingTime);
//   });
// };

// export const documentsHandlers = [
//   // Handler pour récupérer les types de documents autorisés
//   http.get(`${API_BASE_URL}/allowedDocumentTypes`, async () => {
//     return HttpResponse.json(
//       {
//         allowedDocumentTypes,
//       },
//       { status: 200 }
//     );
//   }),

//   // Handler pour créer ou modifier un dossier
//   http.post(`${API_BASE_URL}/folders`, async ({ request }) => {
//     const data = await request.json();
//     const {
//       id, // Requis pour la modification
//       name,
//       reception_email,
//       document_type,
//       retention_duration,
//       status,
//     } = data;

//     const currentDate = new Date().toISOString();

//     // Validation des champs requis
//     const requiredFields = [
//       "name",
//       "reception_email",
//       "document_type",
//       "retention_duration",
//       "status",
//     ];
//     const missingFields = requiredFields.filter((field) => !data[field]);

//     if (missingFields.length > 0) {
//       return HttpResponse.json(
//         {
//           api_message: "MISSING_REQUIRED_FIELDS",
//           missingFields,
//         },
//         { status: 400 }
//       );
//     }

//     // Validation du type de document
//     if (!allowedDocumentTypes.includes(document_type)) {
//       return HttpResponse.json(
//         {
//           api_message: "INVALID_DOCUMENT_TYPE",
//         },
//         { status: 400 }
//       );
//     }

//     // Validation de la durée de rétention (exemple : en jours, doit être un nombre positif)
//     if (
//       typeof retention_duration !== "number" ||
//       (retention_duration !== null && retention_duration <= 0)
//     ) {
//       return HttpResponse.json(
//         {
//           api_message: "INVALID_RETENTION_DURATION",
//         },
//         { status: 400 }
//       );
//     }

//     // Validation de l'email
//     if (!isValidEmail(reception_email)) {
//       return HttpResponse.json(
//         {
//           api_message: "INVALID_EMAIL_FORMAT",
//         },
//         { status: 400 }
//       );
//     }

//     // Vérifier si le nom est unique
//     const nameExists = fakeFolders.some(
//       (folder) => folder.name === name && folder.id !== id
//     );
//     if (nameExists) {
//       return HttpResponse.json(
//         {
//           api_message: "FOLDER_NAME_ALREADY_EXISTS",
//         },
//         { status: 400 }
//       );
//     }

//     if (id) {
//       // Modification d'un dossier existant
//       const folderIndex = fakeFolders.findIndex((folder) => folder.id === id);
//       if (folderIndex === -1) {
//         return HttpResponse.json(
//           {
//             api_message: "FOLDER_NOT_FOUND",
//           },
//           { status: 404 }
//         );
//       }
//       // Mettre à jour les informations du dossier
//       fakeFolders[folderIndex] = new Folder({
//         ...fakeFolders[folderIndex],
//         name,
//         reception_email,
//         document_type,
//         retention_duration,
//         status,
//         updatedAt: currentDate,
//       });
//       return HttpResponse.json(
//         {
//           api_message: "FOLDER_UPDATED_SUCCESSFULLY",
//           folder: fakeFolders[folderIndex],
//         },
//         { status: 200 }
//       );
//     } else {
//       // Création d'un nouveau dossier
//       const newFolder = new Folder({
//         id: generateFolderId(), // Générer un identifiant unique
//         name,
//         reception_email,
//         document_type,
//         retention_duration,
//         status,
//         createdAt: currentDate,
//         updatedAt: currentDate,
//       });

//       fakeFolders.push(newFolder);

//       return HttpResponse.json(
//         {
//           api_message: "FOLDER_CREATED_SUCCESSFULLY",
//           folder: newFolder,
//         },
//         { status: 201 }
//       );
//     }
//   }),
//   // Handler pour lister tous les dossiers
//   /*  http.get(`${API_BASE_URL}/folders`, async () => {
//         return HttpResponse.json(
//             {
//                 folders: fakeFolders,
//             },
//             { status: 200 }
//         );
//     }),*/

//   /**
//    * Handler pour lister les dossiers avec recherche, filtrage et pagination.
//    * Endpoint: GET /folders
//    */
//   http.get(`API_BASE_URL`, async ({ request }) => {
//     console.log("Requête GET /folders");
//     try {
//       const url = new URL(request.url);
//       const search = url.searchParams.get("search") || "";
//       const status = url.searchParams.get("status") || "all";
//       const page = parseInt(url.searchParams.get("page")) || 1;
//       const limit = parseInt(url.searchParams.get("limit")) || 10;

//       // Filtrer les dossiers par statut si spécifié
//       let filteredFolders = fakeFolders;
//       if (status !== "all") {
//         filteredFolders = filteredFolders.filter(
//           (folder) => folder.status === status
//         );
//       }

//       // Appliquer la recherche si spécifiée
//       if (search.trim() !== "") {
//         const lowerCaseSearch = search.toLowerCase();
//         filteredFolders = filteredFolders.filter((folder) => {
//           return (
//             folder.name.toLowerCase().includes(lowerCaseSearch) ||
//             folder.document_type.toLowerCase().includes(lowerCaseSearch) ||
//             folder.reception_email.toLowerCase().includes(lowerCaseSearch)
//           );
//         });
//       }

//       const totalItems = filteredFolders.length;
//       const totalPages = Math.ceil(totalItems / limit);
//       const currentPage = Math.min(page, totalPages) || 1; // Assurer que la page actuelle ne dépasse pas le total

//       // Calculer les indices pour la pagination
//       const startIndex = (currentPage - 1) * limit;
//       const endIndex = startIndex + limit;

//       // Paginer les dossiers
//       const paginatedFolders = filteredFolders.slice(startIndex, endIndex);

//       return HttpResponse.json(
//         {
//           folders: paginatedFolders,
//           pagination: {
//             totalItems,
//             totalPages,
//             currentPage,
//             pageSize: limit,
//             hasNextPage: currentPage < totalPages,
//             hasPrevPage: currentPage > 1,
//           },
//         },
//         { status: 200 }
//       );
//     } catch (error) {
//       console.error(
//         "Erreur lors de la récupération des dossiers avec pagination:",
//         error
//       );
//       return HttpResponse.json(
//         {
//           api_message: "INTERNAL_SERVER_ERROR",
//         },
//         { status: 500 }
//       );
//     }
//   }),
//   // Handler pour récupérer un dossier spécifique par son identifiant
//   http.get(`${API_BASE_URL}/folders/:id`, async ({ params }) => {
//     const { id } = params;
//     const folder = fakeFolders.find((folder) => folder.id === id);

//     if (folder) {
//       return HttpResponse.json(
//         {
//           folder: new Folder(folder),
//         },
//         { status: 200 }
//       );
//     } else {
//       return HttpResponse.json(
//         {
//           api_message: "FOLDER_NOT_FOUND",
//         },
//         { status: 404 }
//       );
//     }
//   }),

//   // Handler pour ajouter un nouveau type de document (Optionnel)
//   http.post(`${API_BASE_URL}/allowedDocumentTypes`, async ({ request }) => {
//     const data = await request.json();
//     const { documentType } = data;

//     if (!documentType) {
//       return HttpResponse.json(
//         {
//           api_message: "MISSING_REQUIRED_FIELDS",
//         },
//         { status: 400 }
//       );
//     }

//     if (allowedDocumentTypes.includes(documentType)) {
//       return HttpResponse.json(
//         {
//           api_message: "DOCUMENT_TYPE_ALREADY_EXISTS",
//         },
//         { status: 400 }
//       );
//     }

//     allowedDocumentTypes.push(documentType);

//     return HttpResponse.json(
//       {
//         api_message: "DOCUMENT_TYPE_ADDED_SUCCESSFULLY",
//         documentType,
//       },
//       { status: 201 }
//     );
//   }),

//   // ------------------- Handlers pour les Documents -------------------
//   // Handler pour lister les documents d'un dossier spécifique avec recherche, filtrage et pagination
//   http.get(
//     `${API_BASE_URL}/folders/:folderId/documents`,
//     async ({ params, request }) => {
//       const url = new URL(request.url);
//       const { folderId } = params;
//       const folder = fakeFolders.find((folder) => folder.id === folderId);

//       if (!folder) {
//         return HttpResponse.json(
//           {
//             api_message: "FOLDER_NOT_FOUND",
//           },
//           { status: 404 }
//         );
//       }

//       // Récupérer les query parameters
//       const search = url.searchParams.get("search") || "";
//       const status = url.searchParams.get("status") || "all";
//       const page = parseInt(url.searchParams.get("page")) || 1;
//       const limit = parseInt(url.searchParams.get("limit")) || 10;

//       // Filtrer les documents par folderId
//       let filteredDocuments = fakeDocuments.filter(
//         (doc) => doc.folderId === folderId
//       );

//       // Appliquer le filtre de statut si spécifié
//       if (status !== "all") {
//         filteredDocuments = filteredDocuments.filter(
//           (doc) => doc.status === status
//         );
//       }

//       // Appliquer la recherche si spécifiée
//       if (search.trim() !== "") {
//         const lowerCaseSearch = search.toLowerCase();
//         filteredDocuments = filteredDocuments.filter((doc) => {
//           // Rechercher dans les champs spécifiés
//           return (
//             doc.nom.toLowerCase().includes(lowerCaseSearch) ||
//             doc.status.toLowerCase().includes(lowerCaseSearch) ||
//             (doc.fichier && doc.fichier.toLowerCase().includes(lowerCaseSearch))
//           );
//         });
//       }

//       const totalItems = filteredDocuments.length;
//       const totalPages = Math.ceil(totalItems / limit);
//       const currentPage = Math.min(page, totalPages) || 1; // Assurer que la page actuelle ne dépasse pas le total

//       // Calculer les indices pour la pagination
//       const startIndex = (currentPage - 1) * limit;
//       const endIndex = startIndex + limit;

//       // Paginer les documents
//       const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

//       return HttpResponse.json(
//         {
//           documents: paginatedDocuments,
//           pagination: {
//             totalItems,
//             totalPages,
//             currentPage,
//             pageSize: limit,
//             hasNextPage: currentPage < totalPages,
//             hasPrevPage: currentPage > 1,
//           },
//         },
//         { status: 200 }
//       );
//     }
//   ),

//   // Handler pour récupérer un document spécifique par son identifiant
//   http.get(`${API_BASE_URL}/documents/:id`, async ({ params }) => {
//     const { id } = params;
//     const document = fakeDocuments.find((doc) => doc.id === id);

//     if (document) {
//       return HttpResponse.json(
//         {
//           document,
//         },
//         { status: 200 }
//       );
//     } else {
//       return HttpResponse.json(
//         {
//           api_message: "DOCUMENT_NOT_FOUND",
//         },
//         { status: 404 }
//       );
//     }
//   }),

//   // Handler pour mettre à jour uniquement la partie correctedData d'un document existant
//   http.patch(
//     `${API_BASE_URL}/documents/:id/correctedData`,
//     async ({ params, request }) => {
//       try {
//         const { id } = params;
//         const data = await request.json();
//         const correctedData = data.correctedData;

//         const documentIndex = fakeDocuments.findIndex((doc) => doc.id === id);

//         if (documentIndex === -1) {
//           return HttpResponse.json(
//             {
//               api_message: "DOCUMENT_NOT_FOUND",
//             },
//             { status: 404 }
//           );
//         }

//         // Validation de correctedData (si présent)
//         if (
//           correctedData &&
//           (typeof correctedData !== "object" || Array.isArray(correctedData))
//         ) {
//           return HttpResponse.json(
//             {
//               api_message: "INVALID_CORRECTED_DATA",
//             },
//             { status: 400 }
//           );
//         }

//         fakeDocuments[documentIndex] = {
//           ...fakeDocuments[documentIndex],
//           correctedData: correctedData,
//           updatedAt: new Date().toISOString(),
//         };
//         return HttpResponse.json(
//           {
//             api_message: "DOCUMENT_CORRECTED_DATA_UPDATED_SUCCESSFULLY",
//             document: fakeDocuments[documentIndex],
//           },
//           { status: 200 }
//         );
//       } catch (error) {
//         console.error("Error updating document:", error);
//         return HttpResponse.json(
//           {
//             api_message: "INTERNAL_SERVER_ERROR",
//           },
//           { status: 500 }
//         );
//       }
//     }
//   ),

//   // Handler pour créer un nouveau document
//   http.post(`${API_BASE_URL}/documents`, async ({ request }) => {
//     try {
//       const formData = await request.formData();

//       const nom = formData.get("name");
//       const dateCreation = formData.get("dateCreation");
//       const dateTraitement = formData.get("dateTraitement") || null;
//       const status = formData.get("status");
//       const folderId = formData.get("folder_id");
//       const fichier = formData.get("file") ? formData.get("file").name : null; // Simuler le fichier en prenant son nom
//       const structuredDataStr = formData.get("structuredData");
//       const correctedDataStr = formData.get("correctedData") || "{}";

//       // Parse JSON strings
//       let structuredData;
//       let correctedData;

//       try {
//         structuredData = JSON.parse(structuredDataStr);
//       } catch (error) {
//         return HttpResponse.json(
//           {
//             api_message: "INVALID_STRUCTURED_DATA_JSON",
//           },
//           { status: 400 }
//         );
//       }

//       try {
//         correctedData = JSON.parse(correctedDataStr);
//       } catch (error) {
//         return HttpResponse.json(
//           {
//             api_message: "INVALID_CORRECTED_DATA_JSON",
//           },
//           { status: 400 }
//         );
//       }

//       const currentDate = new Date().toISOString();

//       // Validation des champs requis
//       const requiredFields = ["name", "status", "folder_id", "file"];
//       const missingFields = requiredFields.filter(
//         (field) => !formData.get(field)
//       );

//       if (missingFields.length > 0) {
//         return HttpResponse.json(
//           {
//             api_message: "MISSING_REQUIRED_FIELDS",
//             missingFields,
//           },
//           { status: 400 }
//         );
//       }

//       // Validation du status
//       const allowedStatuses = ["pending", "processed", "archived"];
//       if (!allowedStatuses.includes(status)) {
//         return HttpResponse.json(
//           {
//             api_message: "INVALID_STATUS",
//           },
//           { status: 400 }
//         );
//       }

//       // Validation de la structure JSON pour structuredData
//       if (typeof structuredData !== "object" || Array.isArray(structuredData)) {
//         return HttpResponse.json(
//           {
//             api_message: "INVALID_STRUCTURED_DATA",
//           },
//           { status: 400 }
//         );
//       }

//       // Validation de correctedData (si présent)
//       if (
//         correctedData &&
//         (typeof correctedData !== "object" || Array.isArray(correctedData))
//       ) {
//         return HttpResponse.json(
//           {
//             api_message: "INVALID_CORRECTED_DATA",
//           },
//           { status: 400 }
//         );
//       }

//       // Vérifier que le dossier existe
//       const folder = fakeFolders.find((folder) => folder.id === folderId);
//       if (!folder) {
//         return HttpResponse.json(
//           {
//             api_message: "FOLDER_NOT_FOUND",
//           },
//           { status: 404 }
//         );
//       }

//       // Vérifier que le type de document est autorisé
//       if (!allowedDocumentTypes.includes(folder.document_type)) {
//         return HttpResponse.json(
//           {
//             api_message: "UNAUTHORIZED_DOCUMENT_TYPE",
//           },
//           { status: 400 }
//         );
//       }

//       // Vérifier si le nom du document est unique dans le dossier
//       const nameExists = fakeDocuments.some(
//         (doc) => doc.nom === nom && doc.folderId === folderId
//       );
//       if (nameExists) {
//         return HttpResponse.json(
//           {
//             api_message: "DOCUMENT_NAME_ALREADY_EXISTS",
//           },
//           { status: 400 }
//         );
//       }

//       // Création du nouveau document
//       const newDocument = {
//         id: generateDocumentId(),
//         nom,
//         dateCreation,
//         dateTraitement,
//         status,
//         folderId,
//         fichier, // En vrai, ce serait un fichier uploadé, mais ici c'est simulé
//         structuredData,
//         correctedData: correctedData || {},
//         createdAt: currentDate,
//         updatedAt: currentDate,
//       };

//       fakeDocuments.push(newDocument);

//       return HttpResponse.json(
//         {
//           api_message: "DOCUMENT_CREATED_SUCCESSFULLY",
//           document: newDocument,
//         },
//         { status: 201 }
//       );
//     } catch (error) {
//       console.error("Error creating document:", error);
//       return HttpResponse.json(
//         {
//           api_message: "INTERNAL_SERVER_ERROR",
//         },
//         { status: 500 }
//       );
//     }
//   }),

//   // Handler pour mettre à jour un document existant
//   http.put(`${API_BASE_URL}/documents/:id`, async ({ params, request }) => {
//     try {
//       const { id } = params;
//       const formData = await request.formData();

//       const nom = formData.get("nom");
//       const dateCreation = formData.get("dateCreation");
//       const dateTraitement = formData.get("dateTraitement") || null;
//       const status = formData.get("status");
//       const folderId = formData.get("folderId");
//       const fichier = formData.get("fichier")
//         ? formData.get("fichier").name
//         : null; // Simuler le fichier en prenant son nom
//       const structuredDataStr = formData.get("structuredData");
//       const correctedDataStr = formData.get("correctedData") || "{}";

//       // Parse JSON strings
//       let structuredData;
//       let correctedData;

//       try {
//         structuredData = JSON.parse(structuredDataStr);
//       } catch (error) {
//         return HttpResponse.json(
//           {
//             api_message: "INVALID_STRUCTURED_DATA_JSON",
//           },
//           { status: 400 }
//         );
//       }

//       try {
//         correctedData = JSON.parse(correctedDataStr);
//       } catch (error) {
//         return HttpResponse.json(
//           {
//             api_message: "INVALID_CORRECTED_DATA_JSON",
//           },
//           { status: 400 }
//         );
//       }

//       const currentDate = new Date().toISOString();

//       const documentIndex = fakeDocuments.findIndex((doc) => doc.id === id);

//       if (documentIndex === -1) {
//         return HttpResponse.json(
//           {
//             api_message: "DOCUMENT_NOT_FOUND",
//           },
//           { status: 404 }
//         );
//       }

//       // Validation des champs requis pour la mise à jour
//       const requiredFields = [
//         "nom",
//         "dateCreation",
//         "status",
//         "folderId",
//         "fichier",
//         "structuredData",
//       ];
//       const missingFields = requiredFields.filter(
//         (field) => !formData.get(field)
//       );

//       if (missingFields.length > 0) {
//         return HttpResponse.json(
//           {
//             api_message: "MISSING_REQUIRED_FIELDS",
//             missingFields,
//           },
//           { status: 400 }
//         );
//       }

//       // Validation du status
//       const allowedStatuses = ["pending", "processed", "archived"];
//       if (!allowedStatuses.includes(status)) {
//         return HttpResponse.json(
//           {
//             api_message: "INVALID_STATUS",
//           },
//           { status: 400 }
//         );
//       }

//       // Validation de la structure JSON pour structuredData
//       if (typeof structuredData !== "object" || Array.isArray(structuredData)) {
//         return HttpResponse.json(
//           {
//             api_message: "INVALID_STRUCTURED_DATA",
//           },
//           { status: 400 }
//         );
//       }

//       // Validation de correctedData (si présent)
//       if (
//         correctedData &&
//         (typeof correctedData !== "object" || Array.isArray(correctedData))
//       ) {
//         return HttpResponse.json(
//           {
//             api_message: "INVALID_CORRECTED_DATA",
//           },
//           { status: 400 }
//         );
//       }

//       // Vérifier que le dossier existe
//       const folder = fakeFolders.find((folder) => folder.id === folderId);
//       if (!folder) {
//         return HttpResponse.json(
//           {
//             api_message: "FOLDER_NOT_FOUND",
//           },
//           { status: 404 }
//         );
//       }

//       // Vérifier que le type de document est autorisé
//       if (!allowedDocumentTypes.includes(folder.document_type)) {
//         return HttpResponse.json(
//           {
//             api_message: "UNAUTHORIZED_DOCUMENT_TYPE",
//           },
//           { status: 400 }
//         );
//       }

//       // Vérifier si le nom du document est unique dans le dossier
//       const nameExists = fakeDocuments.some(
//         (doc) => doc.nom === nom && doc.folderId === folderId && doc.id !== id
//       );
//       if (nameExists) {
//         return HttpResponse.json(
//           {
//             api_message: "DOCUMENT_NAME_ALREADY_EXISTS",
//           },
//           { status: 400 }
//         );
//       }

//       // Mettre à jour le document
//       fakeDocuments[documentIndex] = {
//         ...fakeDocuments[documentIndex],
//         nom,
//         dateCreation,
//         dateTraitement,
//         status,
//         folderId,
//         fichier: fichier || fakeDocuments[documentIndex].fichier, // Si aucun nouveau fichier n'est fourni, conserver l'ancien
//         structuredData,
//         correctedData:
//           correctedData || fakeDocuments[documentIndex].correctedData,
//         updatedAt: currentDate,
//       };

//       return HttpResponse.json(
//         {
//           api_message: "DOCUMENT_UPDATED_SUCCESSFULLY",
//           document: fakeDocuments[documentIndex],
//         },
//         { status: 200 }
//       );
//     } catch (error) {
//       console.error("Error updating document:", error);
//       return HttpResponse.json(
//         {
//           api_message: "INTERNAL_SERVER_ERROR",
//         },
//         { status: 500 }
//       );
//     }
//   }),

//   // Handler pour supprimer un document
//   http.delete(`${API_BASE_URL}/documents/:id`, async ({ params }) => {
//     const { id } = params;
//     const documentIndex = fakeDocuments.findIndex((doc) => doc.id === id);

//     if (documentIndex === -1) {
//       return HttpResponse.json(
//         {
//           api_message: "DOCUMENT_NOT_FOUND",
//         },
//         { status: 404 }
//       );
//     }

//     // Supprimer le document
//     fakeDocuments.splice(documentIndex, 1);

//     return HttpResponse.json(
//       {
//         api_message: "DOCUMENT_DELETED_SUCCESSFULLY",
//       },
//       { status: 200 }
//     );
//   }),

//   /**
//    * Handler pour processer des documents de manière asynchrone.
//    * Endpoint: POST /documents/process
//    * Corps de la requête: { "documentIds": ["1", "2", "3"] }
//    */
//   http.post(`${API_BASE_URL}/documents/process`, async ({ request }) => {
//     try {
//       const data = await request.json();
//       const { documentIds } = data;

//       if (!documentIds || !Array.isArray(documentIds)) {
//         return HttpResponse.json(
//           {
//             api_message: "INVALID_REQUEST_BODY",
//             details:
//               'Le corps de la requête doit contenir un tableau "documentIds".',
//           },
//           { status: 400 }
//         );
//       }

//       // Vérifier que tous les documents existent
//       const missingDocuments = documentIds.filter(
//         (docId) => !fakeDocuments.some((doc) => doc.id === docId)
//       );

//       if (missingDocuments.length > 0) {
//         return HttpResponse.json(
//           {
//             api_message: "DOCUMENT_NOT_FOUND",
//             details: `Les documents avec les IDs suivants n'ont pas été trouvés : ${missingDocuments.join(
//               ", "
//             )}.`,
//           },
//           { status: 404 }
//         );
//       }

//       // Générer un thread_id unique
//       const threadId = uuidv4();

//       // Initialiser le statut du processus
//       processStatusMap[threadId] = {
//         status: "processing",
//         documents: documentIds.reduce((acc, docId) => {
//           acc[docId] = "pending";
//           return acc;
//         }, {}),
//       };

//       // Simuler le traitement asynchrone des documents
//       simulateDocumentProcessing(threadId, documentIds);

//       return HttpResponse.json(
//         {
//           api_message: "DOCUMENTS_PROCESSING_STARTED",
//           thread_id: threadId,
//         },
//         { status: 202 }
//       );
//     } catch (error) {
//       console.error("Error processing documents:", error);
//       return HttpResponse.json(
//         {
//           api_message: "INTERNAL_SERVER_ERROR",
//         },
//         { status: 500 }
//       );
//     }
//   }),

//   /**
//    * Handler pour vérifier le statut du processus de traitement des documents.
//    * Endpoint: GET /documents/process/status/:threadId
//    */
//   http.get(
//     `${API_BASE_URL}/documents/process/status/:threadId`,
//     async ({ params }) => {
//       const { threadId } = params;
//       const processInfo = processStatusMap[threadId];

//       if (!processInfo) {
//         return HttpResponse.json(
//           {
//             api_message: "THREAD_NOT_FOUND",
//           },
//           { status: 404 }
//         );
//       }

//       return HttpResponse.json(
//         {
//           thread_id: threadId,
//           status: processInfo.status, // 'processing' ou 'completed'
//           documents: processInfo.documents, // { documentId: 'pending' | 'processed' }
//         },
//         { status: 200 }
//       );
//     }
//   ),
// ];
