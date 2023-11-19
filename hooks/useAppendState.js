import { useState } from 'react';

const useAppendState = () => {
  const [items, setItems] = useState([]);
  const appendItem = (newItem) => {
    setItems(prev => [...prev, newItem])
  }

  return [items, appendItem];
}

export default useAppendState;