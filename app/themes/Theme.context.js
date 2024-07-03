import React, {useState, createContext, useMemo, useContext} from 'react';
import {useCallback} from 'react';
import get from 'lodash/get';
import {default as blueTheme} from 'themes/blue-theme.json';
import constanceConfig from 'configurations/Constance.configuration';
export const themeFactory = {
  blue: blueTheme,
};
const ThemeContext = createContext();
export default function ThemeContextProvider({children}) {
  const [themeName, setTheme] = useState(constanceConfig.LIGHT_THEME_KEY);
  const [defaultTheme, setDefaultTheme] = useState(themeFactory.blue);
  const toggleTheme = useCallback(() => {
    const nextTheme =
      themeName === constanceConfig.LIGHT_THEME_KEY
        ? constanceConfig.DARK_THEME_KEY
        : constanceConfig.LIGHT_THEME_KEY;
    setTheme(nextTheme);
  }, [themeName, setTheme]);

  const updateDefaultTheme = useCallback(
    newThemeName => {
      const newThemeObject = get(
        themeFactory,
        [newThemeName],
        themeFactory.orange,
      );
      setDefaultTheme(newThemeObject);
    },
    [setDefaultTheme],
  );

  const contextValue = useMemo(
    () => ({
      themeName,
      setTheme,
      toggleTheme,
      defaultTheme,
      updateDefaultTheme,
    }),
    [themeName, setTheme, toggleTheme, defaultTheme, updateDefaultTheme],
  );
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  const {themeName, defaultTheme} = useContext(ThemeContext);
  return {themeName, defaultTheme};
};
export const useThemeDispatch = () => {
  const {setTheme, toggleTheme, updateDefaultTheme} = useContext(ThemeContext);
  return {setTheme, toggleTheme, updateDefaultTheme};
};
