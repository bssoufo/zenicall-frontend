// // src/mocks/data.js

// import Folder from '../models/FolderModel';

// // In-memory storage pour les dossiers
// export let fakeFolders = [
//     new Folder({
//         id: '1',
//         name: 'Dossier de Factures 2024',
//         reception_email: 'factures2024@example.com',
//         document_type: 'invoices',
//         retention_duration: 365,
//         status: 'active',
//         createdAt: '2024-01-15T10:00:00.000Z',
//         updatedAt: '2024-01-15T10:00:00.000Z',
//     }),
//     new Folder({
//         id: '2',
//         name: 'Commandes Clients Q1',
//         reception_email: 'commandesq1@example.com',
//         document_type: 'orders',
//         retention_duration: 180,
//         status: 'active',
//         createdAt: '2024-02-20T14:30:00.000Z',
//         updatedAt: '2024-02-20T14:30:00.000Z',
//     }),
//     new Folder({
//         id: '3',
//         name: 'Tickets Support Technique',
//         reception_email: 'supporttech@example.com',
//         document_type: 'tickets',
//         retention_duration: 90,
//         status: 'archived',
//         createdAt: '2024-03-10T09:15:00.000Z',
//         updatedAt: '2024-06-10T09:15:00.000Z',
//     }),
//     new Folder({
//         id: '4',
//         name: 'Reçus de Dépenses Bureau',
//         reception_email: 'depensesbureau@example.com',
//         document_type: 'receipts',
//         retention_duration: 730,
//         status: 'active',
//         createdAt: '2024-04-05T16:45:00.000Z',
//         updatedAt: '2024-04-05T16:45:00.000Z',
//     }),
//     new Folder({
//         id: '5',
//         name: 'Contrats Fournisseurs',
//         reception_email: 'contratsfournisseurs@example.com',
//         document_type: 'contracts', // Assurez-vous que 'contracts' est ajouté à allowedDocumentTypes
//         retention_duration: 1095,
//         status: 'active',
//         createdAt: '2024-05-12T11:20:00.000Z',
//         updatedAt: '2024-05-12T11:20:00.000Z',
//     }),
// ];

// // In-memory storage pour les documents
// export let fakeDocuments = [
//     // Exemple de documents initiaux
//     {
//         id: '1',
//         nom: 'Facture #1001',
//         dateCreation: '2024-06-01T09:00:00.000Z',
//         dateTraitement: '2024-06-02T10:00:00.000Z',
//         status: 'processed', // 'pending', 'processed', 'archived'
//         folderId: '1', // Appartient au dossier avec id '1'
//         fichier: 'facture_1001.pdf',
//         structuredData: {
//             "InvoiceIssueDate": "2024-12-05",
//             "InvoiceNumber": "2013786",
//             "Items": [{ "description": "BROTHER TN730 NR", "price": "70,32", "quantity": "1", "unitPrice": "72.498" }],
//             "PaymentMethod": "Visa",
//             "ReceiptNumber": "6021",
//             "SubtotalAmount": "70,32",
//             "TaxAmount": "10,53",
//             "TotalAmount": "80,85",
//             "VendorAddress": {
//                 "original": "4605 Boul De L'Auvergne, Unit 102 Quebec, QC G2C 1H7",
//                 "found": true,
//                 "normalized": "4605 Bd de l'Auvergne #102, Québec City, QC G2C 1H7, Canada",
//                 "number": "4605",
//                 "street": "Bd de l'Auvergne",
//                 "address1": "4605 Bd de l'Auvergne",
//                 "address2": "#102",
//                 "city": "Québec",
//                 "zip": "G2C 1H7",
//                 "county": "Capitale-Nationale",
//                 "state_code": "QC",
//                 "state": "Québec",
//                 "country_code": "CA",
//                 "country": "Canada",
//                 "lat": 46.8235865,
//                 "lng": -71.3563945,
//                 "map": "https://www.google.com/maps/search/?api=1&query=46.8235865,-71.3563945&query_place_id=ChIJtTvtAEuYuEwRXuf4w1OWEWY"
//             },
//             "VendorCompany": "BUREAU EN GROS",
//             "VendorName": "BUREAU EN GROS",
//             "VendorPhone": "418-840-0077",
//             "VendorTaxID": "126152586",
//             "OriginalDocument": {
//                 "name": "image.jpeg",
//                 "url": "https://api.parseur.com/document/gV33uRjLEuvyZS8R.3NbsS091xqq4a2aUqOnw0yqPJB7haAMEsR1.9rZnUm6GoHX/image.jpeg",
//                 "content_type": "image/jpeg",
//                 "size": 109865,
//                 "content_id": "",
//                 "is_inline": false
//             }
//         },
//         correctedData: {
//             "InvoiceIssueDate": "2024-12-05",
//             "InvoiceNumber": "2013786",
//             "Items": [{ "description": "BROTHER TN730 NR", "price": "70,32", "quantity": "1", "unitPrice": "72.498" }],
//             "PaymentMethod": "Visa",
//             "ReceiptNumber": "6021",
//             "SubtotalAmount": "70,32",
//             "TaxAmount": "10,53",
//             "TotalAmount": "80,85",
//             "VendorAddress": {
//               "original": "4605 Boul De L'Auvergne, Unit 102 Quebec, QC G2C 1H7",
//               "found": true,
//               "normalized": "4605 Bd de l'Auvergne #102, Québec City, QC G2C 1H7, Canada",
//               "number": "4605",
//               "street": "Bd de l'Auvergne",
//               "address1": "4605 Bd de l'Auvergne",
//               "address2": "#102",
//               "city": "Québec",
//               "zip": "G2C 1H7",
//               "county": "Capitale-Nationale",
//               "state_code": "QC",
//               "state": "Québec",
//               "country_code": "CA",
//               "country": "Canada",
//               "lat": 46.8235865,
//               "lng": -71.3563945,
//               "map": "https://www.google.com/maps/search/?api=1&query=46.8235865,-71.3563945&query_place_id=ChIJtTvtAEuYuEwRXuf4w1OWEWY"
//           },
//             "VendorCompany": "BUREAU EN GROS",
//             "VendorName": "BUREAU EN GROS",
//             "VendorPhone": "418-840-0077",
//             "VendorTaxID": "126152586",
//         },
//         createdAt: '2024-06-01T09:00:00.000Z',
//         updatedAt: '2024-06-02T10:00:00.000Z',
//     },
//     // Ajoutez d'autres documents si nécessaire
// ];

// // In-memory storage pour les types de documents autorisés
// export let allowedDocumentTypes = ['invoices', 'orders', 'receipts', 'tickets', 'contracts'];

// /**
//  * Fonction pour générer un identifiant unique (simple incrémentation pour la simulation)
//  * @returns {string}
//  */
// let folderIdCounter = 6; // Début à 6 puisque nous avons déjà 5 dossiers
// export const generateFolderId = () => {
//   return (folderIdCounter++).toString();
// };

// // In-memory storage pour les documents
// let documentIdCounter = 2; // Début à 2 puisque nous avons déjà 1 document
// export const generateDocumentId = () => {
//   return (documentIdCounter++).toString();
// };
