import React, {useState, createContext} from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import getTheme, {ThemeOption, themes} from '../util/theme/getTheme';

import {ChildrenProps} from '../shared/types';

interface Props extends ChildrenProps {

}
interface ICustomThemeContext {
  setTheme: (option:ThemeOption) => void,
  currentTheme: ThemeOption
}

// eslint-disable-next-line max-len
export const CustomThemeContext = createContext<Partial<ICustomThemeContext>>({});

const CustomThemeProvider = ({children}: Props) => {
  // Read current theme from localStorage or maybe from an api
  let currentTheme = localStorage.getItem('appTheme');
  const isThemeOption = (item:string): item is ThemeOption => {
    return item in themes;
  };
  if ( !currentTheme || currentTheme && !isThemeOption(currentTheme)) {
    currentTheme = 'normal';
  }

  const [themeName, _setThemeName] = useState(currentTheme);

  //* Retrieve the theme object by theme name
  if (!isThemeOption(themeName)) return;
  const theme = getTheme(themeName);

  //* Wrap _setThemeName to store new theme names in localStorage
  const setThemeName = (name:ThemeOption) => {
    localStorage.setItem('appTheme', name);
    _setThemeName(name);
  };

  const contextValue = {
    currentTheme: themeName,
    setTheme: setThemeName,
  };

  return (
    <CustomThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

export default CustomThemeProvider;