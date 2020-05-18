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
  getSuggestionsOffset(ix, v) {
    return ix ? v + 43 : v;
  },
  // Modal
  getModalBackground(theme) {
    return theme === 'light' ? 'white' : '#121212';
  },
  getModalText(theme) {
    return this.getInputTextColor(theme);
  },
};
