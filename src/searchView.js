import React from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  TextInput,
  Platform,
  Alert,
  View,
} from 'react-native';
import { Toolbar } from 'react-native-zbase';
import { colors } from '../../../res';
import NetInfo from '@react-native-community/netinfo';
import Snackbar from '../../../components/Snackbar';
import Device from '../../../lib/DeviceInfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EstoqueOnline from '../../../lib/EstoqueOnline';

const ActionButton = Toolbar.Button;

interface Props {
  index: number;
  disabled: boolean;
  touchDisabled: Boolean;
  onSearch(s: string): void;
  onBackPress(): void;
  onSearchActive(): void;
  onSyncActive(value: boolean): void;
}

const IOS = Platform.OS === 'ios',
  isTablet = Device.isTablet;

class Search extends React.Component<Props> {
  state = {
    value: '',
    search: false,
    sync: EstoqueOnline.get() && EstoqueOnline.isActive(),
  }

  blur = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ search: false });
  }

  onBackPress = () => {
    this.props.onBackPress && this.props.onBackPress();
  }

  onToggleSearch = () => {
    const search = this.state.search;
    this.setState({ search: !search });
    if (!search) {
      setTimeout(() => (this.props.onSearchActive && this.props.onSearchActive()), 100);
      setTimeout(() => (this.input && this.input.focus()), 600);
    }
  }

  onToggleSync = () => {
    const sync = this.state.sync,
      label = sync ? 'Desativar' : 'Ativar';

    Alert.alert('', `${label} modo online?`, [
      { text: 'Cancelar' },
      { text: label, onPress: () => {
        if (sync) {
          this.handleInactiveSync();
        } else {
          this.handleActiveSync();
        }
      }},
    ]);
  }

  onChangeText = (value) => {
    this.setState({ value });
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => this.onSearch(value.toUpperCase()), 600);
  }

  onSearch = (s) => {
    this.props.onSearch && this.props.onSearch(s.trim());
  }

  handleActiveSync() {
    const onSyncActive = this.props.onSyncActive;
    NetInfo.fetch().then(state => {
      state.isInternetReachable && this.setState({ sync: true }, () => {
        setTimeout(() => (onSyncActive && onSyncActive(true)), 100);
        Snackbar.show({
          title: 'Sincronização do estoque dos itens ativa',
          duration: Snackbar.LENGTH_LONG,
        });
      });
      !state.isInternetReachable && Snackbar.show({
        title: 'Oops, parece que estamos sem conexão',
        duration: Snackbar.LENGTH_LONG,
      });
    });
  }

  handleInactiveSync() {
    const onSyncActive = this.props.onSyncActive;
    this.setState({ sync: false }, () => {
      setTimeout(() => (onSyncActive && onSyncActive(false)), 100);
    });
  }

  render() {
    return (
      <View style={styles.container} >

        <View style={{ flex: 2 }} />
        <View style={{ flex: 8 }} >
          {this.renderInput()}
        </View>
        <View style={{ flex: 2 }} />
        {this.renderBackButton()}
        {this.renderClearButton()}

      </View>
    );
  }

  renderInput = () => {
    if (this.state.search && !this.props.disabled) {
      return (
        <TextInput
          ref={ref => { this.input = ref; }}
          value={this.state.value}
          placeholder='Pesquisar'
          placeholderTextColor={colors.disable_text}
          returnKeyType='search'
          autoCapitalize='none'
          selectTextOnFocus
          underlineColorAndroid='transparent'
          onChangeText={this.onChangeText}
          style={styles.input}
        />
      );
    }
    const i0 = this.props.index === 0;
    return (
      <View style={styles.indicator} >
        <Icon
          name='checkbox-blank-circle'
          color={i0 ? colors.iconDefault : colors.divider}
          size={8}
          style={{ margin: 3 }} />
        <Icon
          name='checkbox-blank-circle'
          color={i0 ? colors.divider : colors.iconDefault}
          size={8}
          style={{ margin: 3 }} />
      </View>
    );
  }

  renderBackButton = () => {
    return (
      <ActionButton
        onPress={this.onBackPress}
        style={styles.backButton}
        touchDisabled={this.props.touchDisabled} >
        <Icon
          name={IOS ? 'keyboard-backspace' : 'arrow-left'}
          color={colors.iconDefault}
          size={24} />
      </ActionButton>
    );
  }

  renderClearButton = () => {
    if (this.props.disabled) { return null; }

    const { search, sync } = this.state,
      buttonStyle = {
        position: 'absolute',
        paddingTop: IOS ? 2 : 0,
      },
      searchPosition = isTablet ? { right: 56 } : { right: 48 },
      syncPosition = { right: 8 };

    return (
      <>
        <ActionButton
          onPress={this.onToggleSearch}
          style={[buttonStyle, searchPosition]}
          touchDisabled={this.props.touchDisabled} >
          <Icon name={search ? 'close' : 'magnify'} color={colors.iconDefault} size={22} />
        </ActionButton>
        <ActionButton
          onPress={this.onToggleSync}
          style={[buttonStyle, syncPosition]}
          touchDisabled={this.props.touchDisabled} >
          <Icon
            name={sync ? 'cloud-check' : 'cloud-off-outline'}
            color={sync ? colors.accent : colors.iconDefault}
            size={24} />
        </ActionButton>
      </>
    );
  }
}

Search.defaultProps = {
  touchDisabled: false,
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
  },
  input: {
    height: 48,
    width: '100%',
    fontSize: 16,
  },
  indicator: {
    flexDirection: 'row',
    height: 48,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    paddingTop: IOS ? 2 : 0,
    left: 8,
  },
});

export default Search;
