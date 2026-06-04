import { createContext, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

const copy = {
  en: { latest: 'Latest News', trending: 'Trending', breaking: 'Breaking News', search: 'Search news' },
  hi: { latest: 'ताजा खबरें', trending: 'ट्रेंडिंग', breaking: 'ब्रेकिंग न्यूज', search: 'समाचार खोजें' }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('sn24_lang') || 'en');
  const value = useMemo(() => ({
    language,
    t: copy[language],
    setLanguage(next) {
      localStorage.setItem('sn24_lang', next);
      setLanguage(next);
    }
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
