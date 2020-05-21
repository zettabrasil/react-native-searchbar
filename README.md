[![npm][npm]][npm-url]
[![size][size]][size-url]

<h1 align="center">React Native SearchBar</h1>

<p align="center">Search Bar for iOS & Android with voice and history features for <a href="https://reactnative.dev/">React Native.</a></p>

## Install

Before install this, take a look on this library:
- [@react-native-community/voice](https://github.com/react-native-community/voice#table-of-contents).

Installation

```
npm i -S @zettabrasil/react-native-searchbar
```

Link the iOS package

```
npx pod-install
```

## Usage

Checkout the [example](https://github.com/zettabrasil/react-native-searchbar/tree/master/example)

This library depends on [react-native-root-siblings](https://github.com/magicismight/react-native-root-siblings) to work properly. So, it is necessary to make the following configuration in the root app component:

```js
import { SearchBarWrapper } from '@zettabrasil/react-native-searchbar';

export default function App() {
  return (
    <SearchBarWrapper>
      <View>
        { /* app content */ }
      </View>
    </SearchBarWrapper>
  );
}
```

[npm]: https://badge.fury.io/js/%40zettabrasil%2Freact-native-searchbar.svg
[npm-url]: https://www.npmjs.com/package/@zettabrasil/react-native-searchbar

[size]: https://badgen.net/packagephobia/publish/@zettabrasil/react-native-searchbar
[size-url]: https://www.npmjs.com/package/@zettabrasil/react-native-searchbar
