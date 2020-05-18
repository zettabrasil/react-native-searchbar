import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RootSiblings, { RootSiblingParent } from 'react-native-root-siblings';
import AsyncStorage from '@react-native-community/async-storage';

import ActionButton from './components/ActionButton';
import HistoryItem from './components/HistoryItem';
import SpeechModal from './components/SpeechModal';
import helper from './helper';
import { useDimensions } from './hooks';

type Props = {
  /**
   * Default value: `light`
   */
  theme: 'light' | 'dark';
  /**
   * Default value: `58`, considering a header with height `56`
   */
  historyTopOffset: Number;
  onSearch(): void;
};

export const Wrapper = Platform.OS === 'ios' ? React.Fragment : RootSiblingParent;

const ios = Platform.OS === 'ios';
const KEY_STORE = 'searchbar:history';

function SearchBar(props: Props) {
  const { isIphoneX } = useDimensions();

  const [value, setValue] = useState('');
  const [search, setSearch] = useState(false);
  const [speech, setSpeech] = useState(false);

  const elements = useRef([]);
  const input = useRef();
  const history = useRef([]);
  const savedHistory = useRef([]);
  const timeoutID = useRef(-1);

  useEffect(() => {
    AsyncStorage.getItem(KEY_STORE)
      .then(data => {
        savedHistory.current = data ? JSON.parse(data) : [];
        history.current = savedHistory.current;
      })
      .catch(() => null);
  }, []);

  const showHistory = () => {
    if (elements.current.length) {
      return;
    }
    let el = new RootSiblings(historyElement());
    elements.current.push(el);
  };

  const destroyHistory = () => {
    const el = elements.current.pop();
    el?.destroy();
  };

  const updateHistory = () => {
    const el = elements.current[0];
    if (el) {
      el && el.update(historyElement());
    }
  };

  const onHistorySelected = (text) => {
    const index = savedHistory.current.indexOf(text);
    if (index > -1) {
      const el = savedHistory.current.splice(index, 1);
      savedHistory.current.unshift(el[0]);
      AsyncStorage.setItem(KEY_STORE, JSON.stringify(savedHistory.current));
    }
    setValue(text);
    input.current.blur();
  };

  const onHistoryDelete = (text, index) => {
    Alert.alert('', 'Remover item do histórico?', [
      { text: 'Cancelar' },
      { text: 'Remover', style: 'destructive', onPress: () => {
        history.current.splice(index, 1);
        const idx = savedHistory.current.indexOf(text);
        if (idx > -1) {
          savedHistory.current.splice(idx, 1);
          AsyncStorage.setItem(KEY_STORE, JSON.stringify(savedHistory.current));
        }
        updateHistory();
      }},
    ]);
  };

  const onChangeText = text => {
    setValue(text);
    clearTimeout(timeoutID.current);
    // timeoutID.current = setTimeout(() => this.onSearch(value.toUpperCase()), 600);
    timeoutID.current = setTimeout(() => {
      const filtered = savedHistory.current.filter(v => v.includes(text?.toLowerCase()?.trim()));
      history.current = filtered;
      updateHistory();
    }, 100);
  };

  const onCleanText = () => {
    if (elements.current.length) {
      history.current = savedHistory.current;
      updateHistory();
    }
    setValue('');
    input.current.focus();
  };

  const onActionButtonPress = mic => {
    if (mic) {
      input.current.blur();
      setTimeout(() => {
        setSpeech(true);
      }, 100);
    } else {
      LayoutAnimation.easeInEaseOut();
      setSearch(v => true);
    }
  };

  const onBackButtonPress = () => {
    LayoutAnimation.easeInEaseOut();
    setValue('');
    setSearch(false);
    elements.current.length && onBlur();
  };

  const onBlur = () => {
    history.current = savedHistory.current;
    LayoutAnimation.easeInEaseOut();
    destroyHistory();
  };

  const onFocus = () => {
    setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      showHistory();
    }, 100);
  };

  const onSubmit = v => {
    const val = v.toLowerCase().trim();
    const index = savedHistory.current.indexOf(val);
    if (val && index < 0) {
      savedHistory.current.unshift(val);
      history.current = savedHistory.current;
      AsyncStorage.setItem(KEY_STORE, JSON.stringify(savedHistory.current));
    }
  };

  const onSpeechResults = results => {
    setSpeech(false);
    setTimeout(() => {
      input.current.focus();
      results && onChangeText(results);
    }, 250);
  };

  const historyElement = () => {
    const style = {
      backgroundColor: props.theme === 'dark' ? '#1f1f1f' : 'white',
      top: helper.getSuggestionsOffset(isIphoneX, props.historyTopOffset),
    };
    return (
      <View style={[styles.suggestions, style]} >
        { history.current.map(historyItem) }
      </View>
    );
  };

  const historyItem = (text, index) => (
    <HistoryItem
      key={`his-${index}`}
      item={text}
      onLongPress={() => onHistoryDelete(text, index)}
      onPress={() => onHistorySelected(text)}
      theme={props.theme}
    />
  );

  const actionButton = () => {
    const position = search ? undefined : { position: 'absolute', right: 0 };

    return (
      <ActionButton
        background={helper.getBackgroundColor(props.theme)}
        onPress={() => onActionButtonPress(search)}
        style={[styles.actionButton, position]}
        touchDisabled={false} >
        <Icon name={search ? 'microphone' : 'magnify'} color={helper.getIconColor(props.theme)} size={22} />
      </ActionButton>
    );
  };

  const backButton = () => {
    if (!search) {
      return null;
    }

    const icon = ios ? {
      name: 'chevron-left',
      size: 32,
    } : {
      name: 'arrow-left',
      size: 22,
    };

    return (
      <ActionButton
        background={helper.getBackgroundColor(props.theme)}
        onPress={onBackButtonPress}
        style={styles.backButton}
        touchDisabled={false} >
        <Icon name={icon.name} color={helper.getIconColor(props.theme)} size={icon.size} />
      </ActionButton>
    );
  };

  const cleanButton = () => {
    if (value?.length < 1) {
      return null;
    }

    return (
      <View style={styles.cleanButton} >
        <TouchableOpacity activeOpacity={0.5} onPress={onCleanText} >
          <View style={styles.cleanContentButton} >
            <Icon name='close-circle' color={helper.getIconSecondaryColor(props.theme)} size={16} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderInput = () => {
    if (!search) {
      return null;
    }

    const inputStyle = {
      backgroundColor: helper.getBackgroundColor(props.theme),
      color: helper.getInputTextColor(props.theme),
    };

    return (
      <View style={styles.flex} >
        <TextInput
          autoCapitalize='none'
          autoFocus={true}
          disableFullscreenUI={true}
          onBlur={onBlur}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onSubmitEditing={() => onSubmit(value)}
          placeholder='Pesquisar'
          placeholderTextColor={helper.getPlaceHolderColor(props.theme)}
          ref={input}
          returnKeyType='search'
          selectTextOnFocus={true}
          style={[styles.input, inputStyle]}
          underlineColorAndroid='transparent'
          value={value}
        />
        { cleanButton() }
      </View>
    );
  };

  return (
    <View style={styles.container} >
      { backButton() }
      { renderInput() }
      { actionButton() }
      <SpeechModal
        visible={speech}
        theme={props.theme}
        onRequestClose={onSpeechResults}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 36,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 4,
  },
  actionButton: {
    width: 36,
  },
  backButton: {
    width: 40,
  },
  cleanButton: {
    height: 36,
    position: 'absolute',
    right: 2,
    width: 36,
  },
  cleanContentButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  flex: {
    flex: 1,
  },
  input: {
    borderRadius: 3,
    flex: 1,
    fontSize: 16,
    height: 36,
    marginHorizontal: 4,
    paddingVertical: 0,
    paddingHorizontal: 8,
  },
  suggestions: {
    left: 0,
    right: 0,
    position: 'absolute',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowRadius: 1 * 0.75,
        shadowOffset: { height: 1 * 0.45 },
      },
      android: {
        elevation: 1,
      },
    }),
  },
});

SearchBar.defaultProps = {
  theme: 'light',
  historyTopOffset: 58,
};

export default SearchBar;
