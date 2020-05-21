import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Voice from '@react-native-community/voice';
import helper from '../helper';
import Icon from './Icon';
import ActionButton from './ActionButton';

type Props = {
  background: String;
  onRequestClose(results: String): void;
  theme: 'light' | 'dark',
  visible: Boolean;
}

function Speech(props: Props) {
  const [results, setResults] = useState('');
  const savedResults = useRef('');

  const backgroundStyle = { backgroundColor: helper.getModalBackground(props) };
  const titleStyle = { color: helper.getModalText(props.theme) };
  const speechStyle = {
    color: helper.getModalText(props.theme),
    fontSize: results ? 18 : 16,
    fontWeight: results ? 'bold' : 'normal',
  };

  const lang = helper.lang();

  const onRequestClose = () => {
    props.onRequestClose && props.onRequestClose(savedResults.current);
  };

  useEffect(() => {
    Voice.onSpeechPartialResults = e => {
      savedResults.current = e?.value[0]?.toLocaleLowerCase()?.trim();
      setResults(savedResults.current);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (props.visible) {
      setResults('');
      savedResults.current = '';
      Voice.start(lang.speech_voice_config);
    } else {
      Voice.stop();
    }
  }, [props.visible]);

  const actionButton = () => {
    return (
      <ActionButton
        background={helper.getBackgroundColor(props.theme)}
        onPress={onRequestClose}
        style={styles.actionButton}
        touchDisabled={false} >
        <Icon name='checkbox-marked-circle-outline' color={helper.getIconColor(props.theme)} size={34} />
      </ActionButton>
    );
  };

  return (
    <Modal
      animationType='fade'
      onRequestClose={onRequestClose}
      transparent={true}
      visible={props.visible}
    >
      <>
        <StatusBar
          animated={true}
          barStyle='light-content'
          backgroundColor={helper.getModalStatusbarBackground(props)}
        />
        <View style={styles.flex} >
          <View style={[styles.card, backgroundStyle]} >
            <View style={styles.body} >
              <Text style={[styles.listening, titleStyle]} >
                { lang.speech_listening_label }
              </Text>
              <Text style={[styles.results, speechStyle]} >
                {`"${results || lang.speech_placeholder_label}"`}
              </Text>
            </View>
            <View style={styles.button} >
              { actionButton() }
            </View>
          </View>
        </View>
      </>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 5,
    height: 350,
    width: '80%',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowRadius: 8 * 0.75,
        shadowOffset: { height: 8 * 0.45 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
  body: {
    flex: 1,
    padding: 24,
  },
  button: {
    height: 72,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  listening: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  results: {
    alignSelf: 'center',
    fontStyle: 'italic',
    marginTop: 96,
    opacity: 0.6,
  },
  actionButton: {
    width: 40,
    height: 40,
  },
});

export default Speech;
