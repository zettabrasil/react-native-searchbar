import React, { useState, useRef } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionButton from './components/ActionButton';

function SearchBar() {
  const [value, setValue] = useState('');
  const [search, setSearch] = useState(false);
  const input = useRef();
  const timeoutID = useRef(-1);

  const onChangeText = v => {
    setValue(v);
    // clearTimeout(timeoutID.current);
    // timeoutID.current = setTimeout(() => this.onSearch(value.toUpperCase()), 600);
  }

  const renderClearButton = () => {
    return (
      <ActionButton
        onPress={() => null}
        style={styles.buttonStyle}
        touchDisabled={false} >
        <Icon name={search ? 'close' : 'magnify'} color='rgba(0,0,0,0.56)' size={22} />
      </ActionButton>
    );
  };

  const renderInput = () => {
    return (
      <TextInput
        ref={input}
        value={value}
        placeholder='Pesquisar'
        placeholderTextColor='rgba(0,0,0,0.34)'
        returnKeyType='search'
        autoCapitalize='none'
        selectTextOnFocus={true}
        underlineColorAndroid='transparent'
        onChangeText={onChangeText}
        style={styles.input}
      />
    );
  };

  return (
    <View style={styles.container} >
      <View style={{ flex: 1 }} >
        { renderInput() }
      </View>
      { renderClearButton() }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 8,
  },
  buttonStyle: {
    position: 'absolute',
    left: 8,
  },
  input: {
    height: 48,
    width: '100%',
    fontSize: 16,
  },
});

export default SearchBar;
