import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import axiosInstance from "@/api/axiosInstance";

const mergeTranslations = (
  apiObj: any,
  fallbackObj: any,
  path: string = ""
): any => {
  if (typeof fallbackObj !== "object" || fallbackObj === null) {
    if (typeof apiObj === "string" && apiObj.trim() !== "") {
      return apiObj;
    }
    return "";
  }

  if (typeof apiObj !== "object" || apiObj === null) {
    if (typeof apiObj === "string" && apiObj.trim() !== "") {
      return apiObj;
    }
    return fallbackObj;
  }

  const result: any = {};

  const allKeys = new Set([
    ...Object.keys(fallbackObj),
    ...Object.keys(apiObj),
  ]);

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const apiVal = apiObj[key];
    const fallbackVal = fallbackObj[key];

    if (typeof apiVal === "string" || typeof fallbackVal === "string") {
      if (typeof apiVal === "string" && apiVal.trim() !== "") {
        result[key] = apiVal;
      } else if (typeof fallbackVal === "string" && fallbackVal.trim() !== "") {
        result[key] = fallbackVal;
      } else {
        result[key] = "";
      }
    } else {
      result[key] = mergeTranslations(apiVal, fallbackVal, currentPath);
    }
  }

  return result;
};

export const loadTranslations = async (lng: string) => {
  try {
    const [apiResRaw, fallbackResRaw] = await Promise.all([
      axiosInstance.get(`/client/languages/${lng}`).then((res) => {
        return res.data;
      }),
      fetch("/locales/fr.json")
        .then(async (res) => {
          if (!res.ok) {
            return {};
          }
          const data = await res.json();
          return data;
        })
        .catch((err) => {
          console.warn(
            "Erreur lors du chargement du fichier de fallback :",
            err
          );
          return {};
        }),
    ]);

    const apiRes =
      typeof apiResRaw === "object" && apiResRaw !== null ? apiResRaw : {};
    const fallbackRes =
      typeof fallbackResRaw === "object" && fallbackResRaw !== null
        ? fallbackResRaw
        : {};

    const merged = mergeTranslations(apiRes, fallbackRes);

    return merged;
  } catch (error) {
    console.error("❌ Erreur chargement des traductions :", error);

    try {
      const fallbackRes = await fetch("/locales/fr.json");
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        return data;
      }
    } catch (err) {
      console.warn("❌ Fallback également échoué :", err);
    }

    return {};
  }
};

let isChangingLanguage = false;

export const changeLanguageWithReload = async (lng: string) => {
  if (isChangingLanguage) {
    return;
  }

  isChangingLanguage = true;

  try {
    i18n.services.languageDetector?.cacheUserLanguage?.(lng);

    localStorage.setItem("i18nextLng", lng);
    document.cookie = `i18next=${lng}; path=/; max-age=${
      365 * 24 * 60 * 60
    }; SameSite=strict`;

    const translations = await loadTranslations(lng);

    i18n.addResourceBundle(lng, "translation", translations, true, true);
    await i18n.changeLanguage(lng);
  } catch (error) {
    console.error(`❌ Erreur lors du changement de langue vers ${lng}:`, error);
  } finally {
    setTimeout(() => {
      isChangingLanguage = false;
    }, 500);
  }
};

export const initI18n = async (lng: string) => {
  const translations = await loadTranslations(lng);

  const options: InitOptions = {
    lng,
    fallbackLng: "fr",
    debug: false,
    interpolation: { escapeValue: false },
    resources: {
      [lng]: { translation: translations },
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage", "cookie"],
      cookieOptions: {
        path: "/",
        sameSite: "strict",
        expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
      },
      lookupLocalStorage: "i18nextLng",
      lookupCookie: "i18next",
    },
    initImmediate: false,
  };

  await i18n.use(LanguageDetector).use(initReactI18next).init(options);

  return i18n;
};

export default i18n;
