import { LanguageContext } from "../hooks/useLanguage";
import { useState, useEffect } from "react";

import en_home from "../utils/translate/en/home.json";
import en_common from "../utils/translate/en/common.json";
import en_dashboard from "../utils/translate/en/dashboard.json";
import en_transactions from "../utils/translate/en/transactions.json";
import en_ai from "../utils/translate/en/ai.json";
import en_setting from "../utils/translate/en/setting.json";
import en_auth from "../utils/translate/en/auth.json";

import vi_home from "../utils/translate/vi/home.json";
import vi_common from "../utils/translate/vi/common.json";
import vi_dashboard from "../utils/translate/vi/dashboard.json";
import vi_transactions from "../utils/translate/vi/transactions.json";
import vi_ai from "../utils/translate/vi/ai.json";
import vi_setting from "../utils/translate/vi/setting.json";
import vi_auth from "../utils/translate/vi/auth.json";

const TRANSLATIONS = {
  en: {
    home: en_home,
    common: en_common,
    dashboard: en_dashboard,
    transactions: en_transactions,
    ai: en_ai,
    setting: en_setting,
    auth: en_auth,
  },
  vi: {
    home: vi_home,
    common: vi_common,
    dashboard: vi_dashboard,
    transactions: vi_transactions,
    ai: vi_ai,
    setting: vi_setting,
    auth: vi_auth,
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("language") || "vi");

  useEffect(() => {
    localStorage.setItem("language", lang);
  }, [lang]);

  const t = (key, fallback = "") => {
    if (!key || typeof key !== "string") return fallback || key;

    const parts = key.split(".");

    const tryResolve = (root) => {
      let node = root;
      for (const p of parts) {
        if (node && typeof node === "object" && p in node) {
          node = node[p];
        } else {
          return undefined;
        }
      }
      return node;
    };

    // 1) Thử resolve trực tiếp từ gốc (ví dụ "setting.pageTitle")
    const direct = tryResolve(TRANSLATIONS[lang]);
    if (direct !== undefined) return direct;

    // 2) Thử tìm trong từng namespace con (ví dụ "headings.profile" nằm trong setting.json)
    for (const ns of Object.values(TRANSLATIONS[lang])) {
      const v = tryResolve(ns);
      if (v !== undefined) return v;
    }

    // 3) Fallback về tham số fallback hoặc trả về chính key
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage: setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
