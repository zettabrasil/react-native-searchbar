module.exports = {
  root: true,
  extends: '@react-native-community',

  /**
   * 0-off 1-warn 2-error
   */
  rules: {
    'prettier/prettier': 0,
    'indent': [2, 2, {SwitchCase: 1}],
    'semi': [2, 'always'],
    'quotes': [2, 'single'],
    'jsx-quotes': [2, 'prefer-single'],
    'react-hooks/exhaustive-deps': [0],
    'radix': [0],
  }
};
