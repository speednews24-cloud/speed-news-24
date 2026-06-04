import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(localStorage.getItem('sn24_dark') === 'true');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('sn24_dark', String(dark));
  }, [dark]);
  const value = useMemo(() => ({ dark, setDark }), [dark]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
