import { useState, useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

// You can import supported modules from npm
import ApiKeyField from './components/ApiKeyField';
import ConvoIdField from './components/ConvoIdField';
import TypeSelector from './components/TypeSelector';
import ToggleListenButton from './components/ToggleListenButton';
import LogDisplay from './components/LogDisplay';

import useAppendState from './hooks/useAppendState';

const RE_CONVO_ID = /^\d[a-z\d]+$/;
const RE_API_KEY= /^pkey_[a-zA-Z\d]+$/;

import NfcManager from 'react-native-nfc-manager';

// NfcManager.start();
//requestNfcPermission();

function generateRandom(maxLimit = 100){
  let rand = Math.random() * maxLimit;

  rand = Math.ceil(rand);

  return rand;
}

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [logs, appendLog] = useAppendState();
  const [voteType, setVoteType] = useState('agree');
  const [convoId, setConvoId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [errors, setErrors] = useState({});

  const enableNfcFirst = () => {
    if (!nfcEnabled) {
      //NfcManager.start();
      setNfcEnabled(true);
    }
  }

  const validateForm = () => {
    const errors = {};

    if (!apiKey.match(RE_API_KEY)) errors.apiKey = 'API Key is malformed';
    if (!convoId.match(RE_CONVO_ID)) errors.convoId = 'Conversation ID is malformed';
    setErrors(errors);

    return Object.keys(errors).length === 0;
  }

  // Inspect at https://public.requestbin.com/r/en4iffj008bnd
  const API_BASE_URL = 'https://en4iffj008bnd.x.pipedream.net/api';

  const voteActiveStatement = ({ convoId, apiKey, voteType, userId }) => {
    return fetch(`${API_BASE_URL}/conversations/${convoId}/votes`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        statementId: false,
        voteType,
        userId,
      }),
    });
  };

  useEffect(() => {
    let interval;
    if (isListening) {
      //validateForm();
      const registerVote = () => {
        const mockUid = generateRandom();
        appendLog(`Registered vote by user ${mockUid} for ${voteType}`);
        voteActiveStatement({ apiKey, voteType, convoId, userId: mockUid });
      }
      interval = setInterval(registerVote, 1000);
    }

    return () => clearInterval(interval);
  }, [isListening, apiKey, voteType, convoId, appendLog]);

  const toggleListening = () => {
    enableNfcFirst();
    if (!validateForm()) return
    setIsListening(previousState => !previousState);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ApiKeyField disabled={isListening} value={apiKey} onValueChange={setApiKey} error={errors.apiKey} />
      <ConvoIdField disabled={isListening} value={convoId} onValueChange={setConvoId} error={errors.convoId} />
      <TypeSelector disabled={isListening} value={voteType} onValueChange={setVoteType} />
      <ToggleListenButton onClick={toggleListening} {...{isListening}} />
      <Text>Logs:</Text>
      <LogDisplay logs={logs} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    paddingTop: 24,
    justifyContent: 'flex-start',
    backgroundColor: '#ecf0f1',
  },
});
