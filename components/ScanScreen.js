import {useEffect} from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

import {PermissionsAndroid} from 'react-native';

export const requestNfcPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.NFC
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("NFC permission granted");
    } else {
      console.log("NFC permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

export default function ScanScreen() {

  useEffect(() => {
    const cleanUp = () => {
      NfcManager.cancelTechnologyRequest().catch(() => 0);
    }
    return cleanUp;
  }, []);

  const startNfcScan = async () => {
    try {
      await NfcManager.requestTechnology(Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log('Scanned NFC tag:', tag);
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => 0);  
    }
  }

  return (
    <TouchableOpacity onPress={startNfcScan}>
      <Text>Scan NFC Tag</Text> 
    </TouchableOpacity>
  );
}