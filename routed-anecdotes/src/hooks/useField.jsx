import { useState } from "react";

export const useField = (name) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    name,
    value,
    onChange,
  };
};

// moduulissa voi olla monta nimettyä eksportia, joita voi tuoda erikseen esim. import { anotherFunction } from './useField';
export const anotherFunction = () => {
  // some other functionality
};
