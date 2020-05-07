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
  <View style={[styles.iconButtonHeader, props.style]} >
    <Touchable
      activeOpacity={0.6}
      background={Touchable.Ripple(props.background, true)}
      disabled={props.touchDisabled}
      onPress={props.onPress} >
      <View style={styles.iconHeader} >
        {props.children}
      </View>
    </Touchable>
  </View>
));

Button.defaultProps = {
  touchDisabled: false,
}

const styles = StyleSheet.create({
  iconButtonHeader: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  iconHeader: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Button;
