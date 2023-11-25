import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-native-use-websocket';
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
const RE_API_KEY = /^pkey_[a-zA-Z\d]+$/;
const VOTE_TYPES = {agree: 1, pass: 0, disagree: -1}
const WEBSOCKET_URL = 'ws://127.0.0.1:1999/party/main'

import NfcManager, { NfcTech, NfcEvents } from 'react-native-nfc-manager';

//NfcManager.start();

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
  const [hasNfc, setHasNFC ] = useState(null);

  const { sendMessage, lastMessage, readyState } = useWebSocket(WEBSOCKET_URL, {
    shouldReconnect: (closeEvent) => true,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  async function readNfc() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag.id);
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  const readAnyTag = async () => {
    await NfcManager.registerTagEvent();
  }

  const enableNfcFirst = () => {
    if (!nfcEnabled) {
      NfcManager.start();
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
  // const API_BASE_URL = 'https://en4iffj008bnd.x.pipedream.net/api/v3';
  const API_BASE_URL = 'https://pol.is/api/v3';

  const MOCK_ACTIVE_STATEMENT = 26;

  const fetchUser = (seed) => {
    return fetch('https://randomuser.me/api/1.3?seed=' + seed)
      .then(res => res.json()).then(data => data.results[0])
  }

  const voteActiveStatement = ({ convoId, apiKey, voteType, userId }) => {
    fetchUser(userId)
      .then(user => {
        const fullName = `${user.name.first} ${user.name.last}`;
        return fetch(`${API_BASE_URL}/votes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'foo',
          },
          body: JSON.stringify({
            vote: VOTE_TYPES[voteType],
            tid: MOCK_ACTIVE_STATEMENT,
            pid: 'mypid',
            conversation_id: convoId,
            agid: 1,
            xid: userId,
            x_name: fullName,
            x_profile_image_url: user.picture.thumbnail,
          }),
        }).then(res => res.json()).then(data => console.log(data));
      })
  };

  // useEffect(() => {
  //   const checkIsSupported = async () => {
  //     const deviceIsSupported = await NfcManager.isSupported()

  //     setHasNFC(deviceIsSupported)
  //     if (deviceIsSupported) {
  //       await NfcManager.start()
  //     }
  //   }

  //   checkIsSupported()
  // }, [])
  useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
        const userId = tag.id;
        console.warn(`Registered vote by user ${userId} for ${voteType}`);
        appendLog(`Registered vote by user ${userId} for ${voteType}`);
        voteActiveStatement({ apiKey, voteType, convoId, userId });
    })

    return () => {
      // NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    }
  }, [isListening, apiKey, voteType, convoId, appendLog])

  useEffect(() => {
    const debug = false;
    let interval;
    if (isListening) {
      if (debug) {
        const registerVote = () => {
          const mockUid = generateRandom();
          appendLog(`Registered vote by user ${mockUid} for ${voteType}`);
          voteActiveStatement({ apiKey, voteType, convoId, userId: mockUid });
        }
        interval = setInterval(registerVote, 1000);
      } else {
        readAnyTag();
      }
    };

    return () => {
      if (debug) {
        clearInterval(interval);
      } else {
        NfcManager.unregisterTagEvent();
      }
    };
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
      <Text>{connectionStatus}</Text>
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
