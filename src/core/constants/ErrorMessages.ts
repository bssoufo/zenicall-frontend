export const errorMessages: Record<string, { en: string; fr: string }> = {
  GENERIC_ERROR: {
    en: "Something went wrong. Please try again.",
    fr: "Quelque chose s'est mal passé. Veuillez réessayer.",
  },
  UNAUTHORIZED: {
    en: "You are not authorized to do this.",
    fr: "Vous n'êtes pas autorisé à faire cela.",
  },
  FORBIDDEN: {
    en: "You do not have access.",
    fr: "Vous n'avez pas accès.",
  },
  NOT_FOUND: {
    en: "We could not find what you are looking for.",
    fr: "Nous n'avons pas trouvé ce que vous cherchez.",
  },
  BAD_REQUEST: {
    en: "Your request is invalid.",
    fr: "Votre demande est invalide.",
  },
  CONFLICT: {
    en: "There is a conflict with your request.",
    fr: "Il y a un conflit avec votre demande.",
  },
  EMAIL_ALREADY_USED: {
    en: "This email is already in use.",
    fr: "Cet email est déjà utilisé.",
  },
  USERNAME_ALREADY_USED: {
    en: "This username is already in use.",
    fr: "Ce nom d'utilisateur est déjà utilisé.",
  },
  NO_REGISTRATION_REQUEST: {
    en: "No registration request found.",
    fr: "Aucune demande d'inscription trouvée.",
  },
  INVALID_CODE: {
    en: "The code you entered is invalid.",
    fr: "Le code que vous avez saisi est invalide.",
  },
  CODE_EXPIRED: {
    en: "The code has expired.",
    fr: "Le code a expiré.",
  },
  INVALID_CREDENTIALS: {
    en: "Your login details are incorrect.",
    fr: "Vos informations de connexion sont incorrectes.",
  },
  PASSWORD_RESET_ERROR: {
    en: "We could not reset your password.",
    fr: "Nous n'avons pas pu réinitialiser votre mot de passe.",
  },
  OTP_NOT_VALIDATED: {
    en: "You need to validate the OTP.",
    fr: "Vous devez valider le code OTP.",
  },
  NO_RESET_REQUEST: {
    en: "No password reset request found.",
    fr: "Aucune demande de réinitialisation de mot de passe trouvée.",
  },
  EMAIL_ALREADY_EXIST: {
    en: "This email already exists.",
    fr: "Cet email existe déjà.",
  },
  FOLDER_ALREADY_EXIST: {
    en: "A folder with this name already exists.",
    fr: "Un dossier avec ce nom existe déjà.",
  },
  DOCUMENT_NOT_FOUND: {
    en: "The document was not found.",
    fr: "Le document est introuvable.",
  },
  FOLDER_NOT_FOUND: {
    en: "The folder was not found.",
    fr: "Le dossier est introuvable.",
  },
  DOCUMENT_TYPE_NOT_ALLOWED: {
    en: "This document type is not allowed.",
    fr: "Ce type de document n'est pas autorisé.",
  },
  ONE_OR_MORE_DOCUMENTS_NOT_FOUND: {
    en: "One or more documents were not found.",
    fr: "Un ou plusieurs documents sont introuvables.",
  },
  PASSWORD_MISMATCH: {
    en: "Password and confirmation do not match",
    fr: "Le mot de passe et la confirmation ne correspondent pas",
  },
};
