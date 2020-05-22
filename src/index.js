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
import RootSiblings, { RootSiblingParent } from 'react-native-root-siblings';
import AsyncStorage from '@react-native-community/async-storage';

import {
  ActionButton,
  HeaderAction,
  HeaderTitle,
  HistoryItem,
  Icon,
  SpeechModal,
  Title,
} from './components';
import helper from './helper';
import { useBackHandler, useDimensions, useEvents } from './hooks';
import Events from './hooks/events';

type Props = {
  /**
   * Background color. This prop must be combined with the `theme` prop.
   */
  background: String;
  disableAnimations: Boolean;
  inputPlaceholder: String;
  headerLeft: JSX.Element;
  headerRight: JSX.Element;
  headerTitle: String | JSX.Element;
  /**
   * Default value: `56`, considering a header with height `56`.
   */
  historyTopOffset: Number;
  /**
   * The default value comes from the device system settings.
   */
  locale: 'en_us' | 'pt_br';
  /**
   * Use this to save multiple saves of history. Default value: `default`.
   */
  storageSuffix: String;
  /**
   * Default value: `light`.
   */
  theme: 'light' | 'dark';
  onChangeText(text: String): void;
  onShow(): void;
};

export const SearchBarWrapper = Platform.OS === 'ios' ? React.Fragment : RootSiblingParent;

const ios = Platform.OS === 'ios';

function SearchBar(props: Props) {
  const { isIphoneX } = useDimensions();

  const [value, setValue] = useState('');
  const [search, setSearch] = useState(false);
  const [speech, setSpeech] = useState(false);

  const elements = useRef([]);
  const input = useRef();
  const history = useRef([]);
  const savedHistory = useRef([]);
  const searchRef = useRef(false);
  const historyTimeout = useRef(-1);
  const searchTimeout = useRef(-1);

  const storeKey = `searchbar:history:${props.storageSuffix}`;
  const lang = helper.lang(props.locale);

  useEffect(() => {
    AsyncStorage.getItem(storeKey)
      .then(data => {
        savedHistory.current = data ? JSON.parse(data) : [];
        history.current = JSON.parse(JSON.stringify(savedHistory.current));
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useBackHandler(() => {
    if (searchRef.current) {
      onBackButtonPress();
      return true;
    }
    return false;
  });

  useEvents('dismiss', suffix => {
    if (props?.storageSuffix === suffix) {
      searchRef.current && onBackButtonPress();
    }
  });

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
      AsyncStorage.setItem(storeKey, JSON.stringify(savedHistory.current));
    }
    setValue(text);
    input.current.blur();
    props.onChangeText && props.onChangeText(text);
  };

  const onHistoryDelete = (text) => {
    Alert.alert('', lang.dialog_remove_message, [
      { text: lang.dialog_remove_cancel_btn },
      { text: lang.dialog_remove_confirm_btn, style: 'destructive', onPress: () => {
        const index = savedHistory.current.indexOf(text);
        if (index > -1) {
          savedHistory.current.splice(index, 1);
          history.current = JSON.parse(JSON.stringify(savedHistory.current));
          AsyncStorage.setItem(storeKey, JSON.stringify(savedHistory.current));
        }
        updateHistory();
      }},
    ]);
  };

  const onChangeText = text => {
    setValue(text);
    clearTimeout(historyTimeout.current);
    clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      props.onChangeText && props.onChangeText(text?.toLowerCase()?.trim());
    }, 600);

    historyTimeout.current = setTimeout(() => {
      const filtered = savedHistory.current.filter(v => v.includes(text?.toLowerCase()?.trim()));
      history.current = JSON.parse(JSON.stringify(filtered));
      updateHistory();
    }, 100);
  };

  const onCleanText = () => {
    if (elements.current.length) {
      history.current = JSON.parse(JSON.stringify(savedHistory.current));
      updateHistory();
    }
    setValue('');
    input.current.focus();
    setTimeout(() => {
      props.onChangeText && props.onChangeText('');
    }, 100);
  };

  const onActionButtonPress = mic => {
    if (mic) {
      input.current.blur();
      setTimeout(() => {
        setSpeech(true);
      }, 100);
    } else {
      !props.disableAnimations && LayoutAnimation.easeInEaseOut();
      setSearch(v => true);
      setTimeout(() => {
        props.onShow && props.onShow();
      }, 100)
    }
  };

  const onBackButtonPress = () => {
    !props.disableAnimations && LayoutAnimation.easeInEaseOut();
    setValue('');
    setSearch(false);
    elements.current.length && onBlur();
    setTimeout(() => {
      props.onChangeText && props.onChangeText('');
    }, 200);
  };

  const onBlur = () => {
    history.current = JSON.parse(JSON.stringify(savedHistory.current));
    !props.disableAnimations && LayoutAnimation.easeInEaseOut();
    destroyHistory();
  };

  const onFocus = () => {
    setTimeout(() => {
      !props.disableAnimations && LayoutAnimation.easeInEaseOut();
      showHistory();
    }, 100);
  };

  const onSubmit = v => {
    const val = v.toLowerCase().trim();
    const index = savedHistory.current.indexOf(val);
    if (val && index < 0) {
      savedHistory.current.unshift(val);
      history.current = JSON.parse(JSON.stringify(savedHistory.current));
      AsyncStorage.setItem(storeKey, JSON.stringify(savedHistory.current));
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
      backgroundColor: helper.getSuggestionsBackground(props),
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

  const backButton = () => {
    const icon = ios ? {
      name: 'chevron-left',
      size: 40,
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
    const inputStyle = {
      backgroundColor: helper.getBackgroundColor(props.theme),
      color: helper.getInputTextColor(props.theme),
    };

    return (
      <View style={styles.flex} >
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          autoFocus={true}
          disableFullscreenUI={true}
          onBlur={onBlur}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onSubmitEditing={() => onSubmit(value)}
          placeholder={lang.input_placeholder}
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

  const renderLeft = () => {
    if (search) {
      return backButton();
    }

    if (React.isValidElement(props.headerLeft)) {
      return props.headerLeft;
    }

    return null;
  };

  const renderRight = () => {
    return (
      <>
        <ActionButton
          background={helper.getBackgroundColor(props.theme)}
          onPress={() => onActionButtonPress(search)}
          style={styles.actionButton}
          touchDisabled={false} >
          <Icon name={search ? 'microphone' : 'magnify'} color={helper.getIconColor(props.theme)} size={24} />
        </ActionButton>
        { !!props.headerRight && props.headerRight }
      </>
    );
  };

  const renderTitle = () => {
    if (search) {
      return renderInput();
    }

    if (!props.headerTitle) {
      return null;
    }

    if (typeof props.headerTitle === 'string') {
      return (
        <Title
          tintColor={helper.getInputTextColor(props.theme)}
          value={props.headerTitle}
        />
      );
    }

    return props.headerTitle;
  };

  return (
    <View style={styles.container} >
      <HeaderAction>
        { renderLeft() }
      </HeaderAction>
      <HeaderTitle>
        { renderTitle() }
      </HeaderTitle>
      <HeaderAction>
        { renderRight() }
      </HeaderAction>

      <SpeechModal
        background={props.background}
        locale={props.locale}
        onRequestClose={onSpeechResults}
        theme={props.theme}
        visible={speech}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
    marginHorizontal: 4,
    marginVertical: 2,
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
  disableAnimations: false,
  historyTopOffset: 56,
  storageSuffix: 'default',
  theme: 'light',
};

SearchBar.dismiss = function(suffix) {
  Events.fire('dismiss', suffix);
}

export default SearchBar;
