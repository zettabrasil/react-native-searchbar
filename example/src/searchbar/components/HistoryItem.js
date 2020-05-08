import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Touchable from 'react-native-platform-touchable';
import helper from '../helper';

type Props = {
  item: String;
  onPress(item): void;
  onLongPress(item): void;
  theme: 'light' | 'dark';
}

export default function HistoryItem(props: Props) {
  const textColor = { color: props.theme === 'dark' ? 'white' : 'black' };

  return (
    <Touchable
      activeOpacity={0.5}
      background={Touchable.Ripple(helper.getBackgroundColor(props.theme))}
      onPress={() => props.onPress && props.onPress(props.item)}
      onLongPress={props.onLongPress} >
      <View style={styles.flex} >
        <View style={styles.left} >
          <Icon name='history' color={helper.getIconSecondaryColor(props.theme)} size={22} />
        </View>
        <View style={styles.center} >
          <Text style={textColor} >{ props.item }</Text>
        </View>
        <View style={styles.right} >
          <Icon name='arrow-top-left' color={helper.getIconSecondaryColor(props.theme)} size={20} />
        </View>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flexDirection: 'row',
  },
  left: {
    height: 48,
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    height: 48,
    flex: 1,
    justifyContent: 'center',
  },
  right: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
