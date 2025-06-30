// // src/mocks/handlers/authentication-handlers.js

// import { http, HttpResponse } from "msw";
// import User from "../../models/UserModel"; // Import the UserModel
// import { AppEnv } from "../../config/AppEnv";

// const API_BASE_URL = AppEnv.API_BASE_URL || "http://localhost:4000";

// // In-memory storage pour les codes de réinitialisation et les codes de validation d'inscription
// const resetCodes = {};
// const registrationCodes = {};

// // Liste des utilisateurs fictifs avec permissions et validation
// const fakeUsers = [
//   new User({
//     first_name: "Jean",
//     last_name: "Dupont",
//     email: "jean.dupont@example.com",
//     username: "jean.dupont@example.com",
//     password: "Password1!",
//     permissions: ["read"],
//     isValidated: true,
//   }),
//   new User({
//     first_name: "Marie",
//     last_name: "Curie",
//     email: "marie.curie@example.com",
//     username: "marie.curie@example.com",
//     password: "Password2@",
//     permissions: ["read", "write"],
//     isValidated: true,
//   }),
//   new User({
//     first_name: "Albert",
//     last_name: "Einstein",
//     email: "admin@example.com",
//     username: "admin@example.com",
//     password: "1234",
//     permissions: ["read", "write", "delete"],
//     isValidated: true,
//   }),
// ];

// export const authenticationHandlers = [
//   // Handler pour la route de connexion
//   http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
//     const data = await request.json();
//     const { email, password } = data;

//     const user = fakeUsers.find(
//       (u) => u.email === email && u.password === password && u.isValidated
//     );

//     if (user) {
//       const responseData = {
//         access_token:
//           "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwidXNlcm5hbWUiOiJic3NvdWZvK2Vzc2FpMUBnbWFpbC5jb20iLCJmaXJzdF9uYW1lIjoiQnJ1bm8iLCJsYXN0X25hbWUiOiJTb3VmbyIsImVtYWlsIjoiYnNzb3Vmbytlc3NhaTFAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOlsiQ1JFQVRFX0RPQ1VNRU5UIiwiUkVBRF9ET0NVTUVOVCIsIlVQREFURV9ET0NVTUVOVCIsIkRFTEVURV9ET0NVTUVOVCIsIkNSRUFURV9GT0xERVIiLCJSRUFEX0ZPTERFUiIsIlVQREFURV9GT0xERVIiLCJERUxFVEVfRk9MREVSIiwiUkVBRF9TVUJTQ1JJUFRJT04iLCJVUERBVEVfU1VCU0NSSVBUSU9OIiwiUkVBRF9PV05fVVNFUiIsIlVQREFURV9PV05fVVNFUiJdLCJleHAiOjE3MzYwNDMyMzR9.oZN2vTUosiAvwyzrRPye5czRHO-bebQbQB3swoRd85c",
//         token_type: "bearer",
//         username: user.username,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         email: user.email,
//       };

//       return HttpResponse.json(responseData, { status: 200 });
//     } else {
//       return HttpResponse.json(
//         {
//           api_message: "INVALID_CREDENTIALS",
//         },
//         { status: 401 }
//       );
//     }
//   }),

//   // Handler pour la route de déconnexion
//   http.post(`${API_BASE_URL}/auth/logout`, async () => {
//     // Invalider le token ou la session ici (simulé)
//     return HttpResponse.json(
//       {
//         api_message: "LOGOUT_SUCCESS",
//       },
//       { status: 200 }
//     );
//   }),

//   // Handler pour la demande de réinitialisation de mot de passe
//   http.post(`${API_BASE_URL}/auth/forgot-password`, async ({ request }) => {
//     const data = await request.json();
//     const { email } = data;

//     const user = fakeUsers.find((u) => u.email === email && u.isValidated);

//     if (user) {
//       // Générer un code de réinitialisation (simulé)
//       const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
//       const expiresAt = Date.now() + 10 * 60 * 1000; // Code valide 10 minutes

//       // Stocker le code avec l'email
//       resetCodes[email] = { code: resetCode, expiresAt };

//       console.log(`Code de réinitialisation pour ${email} : ${resetCode}`); // Simuler l'envoi par email

//       return HttpResponse.json(
//         {
//           api_message: "FORGOT_PASSWORD_SUCCESS",
//         },
//         { status: 200 }
//       );
//     } else {
//       // Pour des raisons de sécurité, ne pas indiquer si l'email existe ou non
//       return HttpResponse.json(
//         {
//           api_message: "FORGOT_PASSWORD_SUCCESS",
//         },
//         { status: 200 }
//       );
//     }
//   }),

//   // Handler pour la vérification du code de réinitialisation
//   http.post(`${API_BASE_URL}/auth/verify-code`, async ({ request }) => {
//     const data = await request.json();
//     const { email, code } = data;

//     const record = resetCodes[email];

//     if (!record) {
//       return HttpResponse.json(
//         {
//           api_message: "NO_RESET_{request}UEST",
//         },
//         { status: 400 }
//       );
//     }

//     if (record.code !== code) {
//       return HttpResponse.json(
//         {
//           api_message: "INVALID_CODE",
//         },
//         { status: 400 }
//       );
//     }

//     if (Date.now() > record.expiresAt) {
//       delete resetCodes[email];
//       return HttpResponse.json(
//         {
//           api_message: "CODE_EXPIRED",
//         },
//         { status: 400 }
//       );
//     }

//     // Code valide, supprimer le code pour éviter les réutilisations
//     delete resetCodes[email];

//     return HttpResponse.json(
//       {
//         api_message: "CODE_VALIDATED",
//       },
//       { status: 200 }
//     );
//   }),

//   // Handler pour la réinitialisation du mot de passe
//   http.post(`${API_BASE_URL}/auth/reset-password`, async ({ request }) => {
//     const data = await request.json();
//     const { email, newPassword } = data;

//     const user = fakeUsers.find((u) => u.email === email && u.isValidated);

//     if (user) {
//       // Mettre à jour le mot de passe (simulé)
//       user.password = newPassword;

//       return HttpResponse.json(
//         {
//           api_message: "PASSWORD_RESET_SUCCESS",
//         },
//         { status: 200 }
//       );
//     } else {
//       return HttpResponse.json(
//         {
//           api_message: "PASSWORD_RESET_ERROR",
//         },
//         { status: 400 }
//       );
//     }
//   }),

//   // Handler pour l'inscription
//   http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
//     const data = await request.json();
//     const { firstName, lastName, email, password } = data;

//     // Vérifier si l'utilisateur existe déjà (par email)
//     const existingUser = fakeUsers.find((u) => u.email === email);

//     if (existingUser) {
//       return HttpResponse.json(
//         {
//           api_message: "EMAIL_ALREADY_USED",
//         },
//         { status: 400 }
//       );
//     }

//     // Create new user with UserModel
//     const newUser = new User({
//       first_name: firstName,
//       last_name: lastName,
//       email,
//       username: email, // Set username to email
//       password,
//       permissions: ["read"], // Permissions par défaut
//       isValidated: false,
//     });

//     fakeUsers.push(newUser);

//     // Générer un code de validation (simulé)
//     const validationCode = Math.floor(
//       100000 + Math.random() * 900000
//     ).toString();
//     const expiresAt = Date.now() + 10 * 60 * 1000; // Code valide 10 minutes

//     // Stocker le code avec l'email
//     registrationCodes[email] = { code: validationCode, expiresAt };

//     console.log(
//       `Code de validation pour l'inscription de ${email} : ${validationCode}`
//     ); // Simuler l'envoi par email

//     return HttpResponse.json(
//       {
//         api_message: "REGISTER_SUCCESS",
//       },
//       { status: 201 }
//     );
//   }),

//   // Handler pour la validation de l'inscription
//   http.post(
//     `${API_BASE_URL}/auth/validate-registration`,
//     async ({ request }) => {
//       const data = await request.json();
//       const { email, code } = data;

//       const record = registrationCodes[email];

//       if (!record) {
//         return HttpResponse.json(
//           {
//             api_message: "NO_REGISTRATION_{request}UEST",
//           },
//           { status: 400 }
//         );
//       }

//       if (record.code !== code) {
//         return HttpResponse.json(
//           {
//             api_message: "INVALID_CODE",
//           },
//           { status: 400 }
//         );
//       }

//       if (Date.now() > record.expiresAt) {
//         delete registrationCodes[email];
//         return HttpResponse.json(
//           {
//             api_message: "CODE_EXPIRED",
//           },
//           { status: 400 }
//         );
//       }

//       // Code valide, marquer l'utilisateur comme validé
//       const user = fakeUsers.find((u) => u.email === email);
//       if (user) {
//         user.isValidated = true;
//       }

//       // Supprimer le code pour éviter les réutilisations
//       delete registrationCodes[email];

//       return HttpResponse.json(
//         {
//           api_message: "VALIDATION_SUCCESS",
//         },
//         { status: 200 }
//       );
//     }
//   ),
// ];
