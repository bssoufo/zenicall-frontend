// src/i18n.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import coreEn from "./i18n/en.json";
import coreFr from "./i18n/fr.json";

import authEn from "../../modules/auth/i18n/en.json";
import authFr from "../../modules/auth/i18n/fr.json";

// import usersEn from "../../modules/users/i18n/en.json";
// import usersFr from "../../modules/users/i18n/fr.json";


import homeEn from "../../modules/home/i18n/en.json";
import homeFr from "../../modules/home/i18n/fr.json";

import usersEn from "../../modules/users/i18n/en.json";
import usersFr from "../../modules/users/i18n/fr.json";
import clinicsEn from "../../modules/clinics/i18n/en.json";
import clinicsFr from "../../modules/clinics/i18n/fr.json";
import callLogsEn from "../../modules/call-logs/i18n/en.json";
import callLogsFr from "../../modules/call-logs/i18n/fr.json";

// Importez d'autres langues ici si nécessaire
const savedLanguage = localStorage.getItem("language") || "en";
const resources = {
  en: {
    core: coreEn,
    auth: authEn,
    home: homeEn,
    users: usersEn,
    clinics: clinicsEn,
    'call-logs': callLogsEn,
  },
  fr: {
    core: coreFr,
    auth: authFr,
    home: homeFr,
    users: usersFr,
    clinics: clinicsFr,
    'call-logs': callLogsFr,
  },
};

i18n
  .use(initReactI18next) // Passe l'instance i18n à react-i18next
  .init({
    resources,

    ns: [
      "core",
      "auth",
      "home",
      "users",
      "clinics",
      "call-logs",
    ], // Espaces de noms (un par module)
    defaultNS: "core",
    lng: savedLanguage, // Langue par défaut
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },
  });

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;
