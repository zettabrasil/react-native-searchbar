import { useEffect, useState, useRef } from 'react';
import { BackHandler, Dimensions, Platform } from 'react-native';
import Events from './events';

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

export function useEvents(event, callback) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (event) {
      const listener = Events.on(event, savedCallback.current);
      return () => listener.remove();
    }
  }, []);

  function dispatch(evt: EventsTypeI, param) {
    Events.fire(evt);
  }

  if (event) {
    return;
  }

  return {
    dispatch,
  };
}
