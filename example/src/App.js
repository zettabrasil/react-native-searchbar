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
import { RootSiblingParent } from 'react-native-root-siblings';
import SearchBar from './searchbar';

const Wrapper = Platform.OS === 'ios' ? React.Fragment : RootSiblingParent;

function App() {
  const [theme, setTheme] = useState('light');
  const isDark = theme === 'dark';

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const containerStyle = {
    backgroundColor: isDark ? '#121212' : '#F5F5F5',
  };
  const headerStyle = {
    backgroundColor: isDark ? '#1f1f1f' : 'white',
  };

  const onThemeChange = () => {
    LayoutAnimation.spring;
    setTheme(v => {
      return v === 'light' ? 'dark' : 'light';
    });
  };

  return (
    <Wrapper>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#121212' : '#F5F5F5'}
      />
      <SafeAreaView style={[styles.flex, containerStyle]} >
        <View style={[styles.header, headerStyle]} >

          <SearchBar theme={theme} />

        </View>
        <View style={styles.content} >
          <Button
            onPress={onThemeChange}
            title={isDark ? 'Change to Light' : 'Change to Dark'}
            color={isDark && Platform.OS === 'ios' ? 'white' : undefined}
          />
        </View>
      </SafeAreaView>
    </Wrapper>
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
});

export default App;
