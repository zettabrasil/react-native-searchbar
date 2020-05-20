/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  Button,
  LayoutAnimation,
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  UIManager,
} from 'react-native';
import Color from 'color';
import SearchBar, { SearchBarWrapper } from '@zettabrasil/react-native-searchbar';

function App() {
  const [theme, setTheme] = useState('light');
  const [custom, setCustom] = useState(false);
  const isDark = theme === 'dark';
  const customColor = '#607D8B';
  const darkCustomColor = Color(customColor).darken(0.2);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const containerStyle = {
    backgroundColor: isDark ? '#121212' : '#F5F5F5',
  };
  const headerStyle = {
    backgroundColor: isDark ? '#1f1f1f' : (custom ? customColor : 'white'),
  };

  const onThemeChange = () => {
    LayoutAnimation.spring;
    setTheme(v => {
      return v === 'light' ? 'dark' : 'light';
    });
  };

  const onCustomThemeChange = () => {
    setCustom(v => !v);
  };

  return (
    <SearchBarWrapper>
      <StatusBar
        barStyle={custom ? 'light-content' : (isDark ? 'light-content' : 'dark-content')}
        backgroundColor={custom ? darkCustomColor : (isDark ? '#121212' : '#F5F5F5')}
      />
      <SafeAreaView style={[styles.flex, containerStyle]} >
        <View style={[styles.header, headerStyle]} >

          {/** SearchBar */}

          <SearchBar
            theme={custom ? 'dark' : theme}
            background={custom ? customColor : undefined}
            historyTopOffset={56}
            onChangeText={s => {
              console.log('results', s);
            }}
            headerTitle='Results'
          />

          {/** SearchBar */}

        </View>
        <View style={styles.content} >
          <Button
            onPress={onThemeChange}
            title={isDark ? 'Change to Light' : 'Change to Dark'}
            color={isDark && Platform.OS === 'ios' ? 'white' : customColor}
          />
          <View style={styles.spacer} />
          <Button
            onPress={onCustomThemeChange}
            title={custom ? 'Disable custom' : 'Active custom'}
            color={isDark && Platform.OS === 'ios' ? 'white' : customColor}
          />
        </View>
      </SafeAreaView>
    </SearchBarWrapper>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    height: 56,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowRadius: 1 * 0.75,
        shadowOffset: { height: 1 * 0.45 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  spacer: {
    height: 8,
  },
});

export default App;
