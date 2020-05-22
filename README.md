[![npm][npm]][npm-url]
[![size][size]][size-url]

<h1 align="center">React Native SearchBar</h1>

<p align="center">Search Bar for iOS & Android with voice and history features for <a href="https://reactnative.dev/">React Native.</a></p>

## Install

```
npm i -S @zettabrasil/react-native-searchbar
```

We will need to install first the following libraries to get this working well:

### [@react-native-community/voice](https://github.com/react-native-community/voice#react-native-voice).
```
npm i -S @react-native-community/voice
```
Need to include permissions for `NSMicrophoneUsageDescription` and `NSSpeechRecognitionUsageDescription` inside Info.plist for iOS. See the included `VoiceTest` for how to handle these cases.

```xml
<dict>
  ...
  <key>NSMicrophoneUsageDescription</key>
  <string>Description of why you require the use of the microphone</string>
  <key>NSSpeechRecognitionUsageDescription</key>
  <string>Description of why you require the use of the speech recognition</string>
  ...
</dict>
```

### [@react-native-community/async-storage](https://github.com/react-native-community/async-storage#react-native-async-storage).
```
npm i -S @react-native-community/async-storage
```

Link the iOS package

```
npx pod-install
```

## Usage

Checkout the [example](https://github.com/zettabrasil/react-native-searchbar/blob/master/example/src/App.js)

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
