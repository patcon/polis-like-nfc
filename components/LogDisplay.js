import * as React from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const Component = ({ logs }) => {
  return (
    <TextInput
      style={styles.multiline}
      mode="outlined"
      multiline={true}
      //dense={true}
      value={logs.join('\n')}
      editable={false}
      numberOfLines={10}
    />
  );
};

const styles = StyleSheet.create({
  multiline: {
    //flex: 1,
    //height: 800,
  },
});

export default Component;