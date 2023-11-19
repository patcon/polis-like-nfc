import * as React from 'react';
import { SegmentedButtons } from 'react-native-paper';

const Component = ({ disabled, value, onValueChange }) => {

  return (
      <SegmentedButtons
        value={value}
        onValueChange={onValueChange}
        style={{marginTop: 8}}
        buttons={[
          { disabled: disabled, value: 'agree', label: 'agree' },
          { disabled: disabled, value: 'disagree', label: 'disagree' },
          { disabled: disabled, value: 'pass', label: 'pass' },
        ]}
      />
  );
};

export default Component;