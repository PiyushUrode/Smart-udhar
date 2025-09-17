// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // Detect browser language
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: {
        translation: {
          dashboard: "Dashboard",
          transactions: "Transactions",
          reports: "Reports",
          budget: "Budget",
          calculator: "Calculator",
        },
      },
      hi: {
        translation: {
          dashboard: "डैशबोर्ड",
          transactions: "लेन-देन",
          reports: "रिपोर्ट्स",
          budget: "बजट",
          calculator: "कैलकुलेटर",
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
