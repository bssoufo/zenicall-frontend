// src/components/LanguageSwitcher.jsx
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    console.log(lng);
  };

  return (
    // <div className="language-switcher">
    //   <button
    //     onClick={() => changeLanguage("en")}
    //     className={i18n.language === "en" ? "active" : ""}
    //     aria-label="Switch to English">
    //     🇺🇸 English
    //   </button>
    //   <button
    //     onClick={() => changeLanguage("fr")}
    //     className={i18n.language === "fr" ? "active" : ""}
    //     aria-label="Passer au français">
    //     🇫🇷 Français
    //   </button>
    //   {/* Ajoutez d'autres langues ici si nécessaire */}
    // </div>

    <>
      <select
        className="iz_lang-select"
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}>
        <option value="en">🇺🇸 English</option>
        <option value="fr">🇫🇷 Français</option>
      </select>
    </>
  );
}
export default LanguageSwitcher;
