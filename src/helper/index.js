import { NativeModules, Platform, I18nManager } from 'react-native';
import Color from 'color';
import lang from './lang';

const locale = Platform.OS === 'ios'
  ? NativeModules.SettingsManager.settings?.AppleLanguages[0] || //iOS 13
    NativeModules.SettingsManager.settings?.AppleLocale
  : NativeModules.I18nManager?.localeIdentifier;

export default {
  getBackgroundColor(theme) {
    return theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.12)';
  },
  getIconColor(theme) {
    return theme === 'light' ? 'rgba(0,0,0,0.56)' : 'white';
  },
  getIconSecondaryColor(theme) {
    return theme === 'light' ? 'rgba(0,0,0,0.38)' : 'rgba(255,255,255,0.5)';
  },
  getInputTextColor(theme) {
    return theme === 'light' ? 'rgba(0,0,0,0.87)' : 'white';
  },
  getPlaceHolderColor(theme) {
    return theme === 'light' ? 'rgba(0,0,0,0.34)' : 'rgba(255,255,255,0.56)';
  },
  getSuggestionsBackground({ background, theme }) {
    if (background) {
      return background;
    }
    return theme === 'dark' ? '#1f1f1f' : 'white';
  },
  getSuggestionsOffset(ix, v) {
    return ix ? v + 43 : v;
  },
  // Modal
  getModalBackground({ background, theme }) {
    if (background) {
      return theme === 'light' ? background : Color(background).darken(0.4);
    }
    return theme === 'light' ? 'white' : Color('#121212').lighten(0.4);
  },
  getModalStatusbarBackground({ background, theme }) {
    if (background) {
      return Color(background).darken(0.6);
    }
    return theme === 'light' ? 'rgba(0,0,0,0.5)' : undefined;
  },
  getModalText(theme) {
    return this.getInputTextColor(theme);
  },

  // Lang
  lang(val) {
    return lang(locale, val);
  },
};
