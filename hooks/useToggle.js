// Source: https://dev.to/ml318097/usetoggle-custom-react-hook-for-toggle-3g7
import { useState } from "react";

const useToggle = (initialState = false) => {
  const [visible, setVisibility] = useState(initialState);

  const toggle = () => setVisibility((prev) => !prev);

  const setToggleStatus = (value) => setVisibility(Boolean(value));

  return [visible, toggle, setToggleStatus];
};

export default useToggle;