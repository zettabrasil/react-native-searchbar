import Color from 'color';

export default {
  getBackgroundColor(theme) {
    return theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)';
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
    return theme === 'light' ? 'rgba(0,0,0,0.34)' : 'rgba(255,255,255,0.5)';
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
      return Color(background).darken(0.4);
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
};
