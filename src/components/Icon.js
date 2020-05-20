import React from 'react';
import { Image } from 'react-native';
import Color from 'color';

type Props = {
  color: String;
  name: String;
  size: Number;
}

function Icon(props: Props) {
  const color = Color(props.color);
  const theme = color.isDark() ? 'white' : 'black';
  const name = `${props.name}-${theme}`;
  const style = {
    height: props.size,
    tintColor: props.color,
    width: props.size,
  };

  return (
    <Image style={style} source={getImageSrc(name)} />
  );
}

const getImageSrc = name => {
  switch (name) {
    case 'arrow-left-black':
      return require('../assets/arrow-left-black.png');
    case 'arrow-left-white':
      return require('../assets/arrow-left-white.png');
    case 'arrow-top-left-black':
      return require('../assets/arrow-top-left-black.png');
    case 'arrow-top-left-white':
      return require('../assets/arrow-top-left-white.png');
    case 'close-circle-black':
      return require('../assets/close-circle-black.png');
    case 'close-circle-white':
      return require('../assets/close-circle-white.png');
    case 'checkbox-marked-circle-outline-black':
      return require('../assets/checkbox-marked-circle-outline-black.png');
    case 'checkbox-marked-circle-outline-white':
      return require('../assets/checkbox-marked-circle-outline-white.png');
    case 'chevron-left-black':
      return require('../assets/chevron-left-black.png');
    case 'chevron-left-white':
      return require('../assets/chevron-left-white.png');
    case 'history-black':
      return require('../assets/history-black.png');
    case 'history-white':
      return require('../assets/history-white.png');
    case 'magnify-black':
      return require('../assets/magnify-black.png');
    case 'magnify-white':
      return require('../assets/magnify-white.png');
    case 'microphone-black':
      return require('../assets/microphone-black.png');
    case 'microphone-white':
      return require('../assets/microphone-white.png');
    default:
      return require('../assets/help.png');
  }
};

Icon.defaultProps = {
  color: 'rgba(0,0,0,0.56)',
  size: 24,
};

export default Icon;
