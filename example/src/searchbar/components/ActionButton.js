import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';

interface Props {
  /**
   * Background color ripple for Android
   */
  background?: string;
  /**
   * If true, disable all interactions for this component.
   */
  touchDisabled?: Boolean;
  /**
   * Define de container style
   */
  style: ViewStyle;
  /**
   * An image or icon element
   */
  children: JSX.Element;
  /**
   * Called when the touch is released
   */
  onPress(): void;
}

const Button = React.memo((props: Props) => (
  <View style={[styles.iconButton, props.style]} >
    <Touchable
      activeOpacity={0.5}
      foreground={Touchable.Ripple(props.background, true)}
      disabled={props.touchDisabled}
      onPress={props.onPress} >
      <View style={styles.icon} >
        {props.children}
      </View>
    </Touchable>
  </View>
));

Button.defaultProps = {
  touchDisabled: false,
};

const styles = StyleSheet.create({
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 100,
  },
  icon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
