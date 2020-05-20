import React from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import ActionButtonJS from './ActionButton';
import HistoryItemJS from './HistoryItem';
import SpeechModalJS from './SpeechModal';
import IconMD from './Icon';

export const ActionButton = ActionButtonJS;
export const HistoryItem = HistoryItemJS;
export const SpeechModal = SpeechModalJS;
export const Icon = IconMD;

export const HeaderAction = props => (
  <View style={styles.action} >
    { props.children }
  </View>
);

export const HeaderTitle = props => (
  <View style={styles.titleContent} >
    { props.children }
  </View>
);

export const Title = ({ tintColor, style, value }) => (
  <Animated.Text
    accessibilityRole='header'
    numberOfLines={1}
    style={[
      styles.title,
      { color: tintColor || 'rgba(0,0,0,0.87)' },
      style,
    ]}
  >{ value }</Animated.Text>
);

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 36,
    justifyContent: 'center',
    minWidth: 44,
  },
  titleContent: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
  },
  title: Platform.select({
    ios: {
      alignSelf: 'center',
      fontSize: 17,
      fontWeight: '600',
    },
    android: {
      fontSize: 20,
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
      marginStart: 8,
    },
    default: {
      fontSize: 18,
      fontWeight: '500',
    },
  }),
});
