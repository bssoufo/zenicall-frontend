import { errorMessages } from "./ErrorMessages";

const getErrorMessageFromCode = (code: string, lang: string = "en") => {
  let message = errorMessages[code];
  if (!message) message = errorMessages["GENERIC_ERROR"];

  if (!message[lang]) return message["fr"];
  return message[lang];
};

export default getErrorMessageFromCode;
