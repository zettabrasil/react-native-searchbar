import { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Platform } from 'react-native';

const w = Dimensions.get('window'),
  s = Dimensions.get('screen'),
  ios = Platform.OS === 'ios';

function isDimensionsIphoneX({ height, width }) {
  return ios && ((height === 812 || width === 812) || (height === 896 || width === 896));
}

function isOrientationLandscape({ width, height }) {
  return width > height;
}

export function useBackHandler(handler: () => boolean) {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handler);

    return () => BackHandler.removeEventListener('hardwareBackPress', handler);
  }, [handler]);
}

export function useDimensions() {
  const [state, setState] = useState({
    isIphoneX: isDimensionsIphoneX(w),
    isLandscape: isOrientationLandscape(w),
    screen: s,
    window: w,
  });

  function onChange({ window, screen }) {
    setState({
      screen,
      window,
      isIphoneX: isDimensionsIphoneX(window),
      isLandscape: isOrientationLandscape(window),
    });
  }

  useEffect(() => {
    Dimensions.addEventListener('change', onChange);
    return () => Dimensions.removeEventListener('change', onChange);
  }, []);

  return state;
}
