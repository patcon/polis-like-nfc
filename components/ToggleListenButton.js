import * as React from 'react';
import { Button } from 'react-native-paper';
import useToggle from '../hooks/useToggle';

const Component = ({ onClick, isListening }) => {

  const handleClick = () => {
    onClick();
  }

  return (
    <Button
      icon={isListening ? "cellphone-nfc-off" : "cellphone-nfc"}
      mode="contained"
      onPress={handleClick}
    >
      { isListening ? "Stop NFC" : "Start NFC" }
    </Button>
  )
};

export default Component;