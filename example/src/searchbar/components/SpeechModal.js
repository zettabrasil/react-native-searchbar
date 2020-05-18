import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Voice from '@react-native-community/voice';
import helper from '../helper';

type Props = {
  visible: Boolean;
  theme: 'light' | 'dark',
  onRequestClose(results: String): void;
}

function Speech(props: Props) {
  const [results, setResults] = useState('');
  const savedResults = useRef('');

  const backgroundStyle = { backgroundColor: helper.getModalBackground(props.theme) };
  const titleStyle = { color: helper.getModalText(props.theme) };
  const speechStyle = {
    color: helper.getModalText(props.theme),
    fontSize: results ? 18 : 16,
    fontWeight: results ? 'bold' : 'normal',
  };

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
      Voice.start('pt-BR');
    } else {
      Voice.stop();
    }
  }, [props.visible]);

  return (
    <Modal
      animationType='fade'
      onRequestClose={onRequestClose}
      transparent={true}
      visible={props.visible}
    >
      <>
        <StatusBar barStyle='light-content' backgroundColor='rgba(0,0,0,0.5)' />
        <View style={styles.flex} >
          <View style={[styles.card, backgroundStyle]} >
            <View style={styles.body} >
              <Text style={[styles.listening, titleStyle]} >Ouvindo...</Text>
              <Text style={[styles.results, speechStyle]} >
                {`"${results || 'Fale alguma coisa...'}"`}
              </Text>
            </View>
            <View style={styles.button} >
              <Button title='Pronto' onPress={onRequestClose} />
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
});

export default Speech;
