import { useState } from "react";

// Custom hook for managing form field state
export const useField = (name) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value); // Update the field value on change
  };

  const reset = () => {
    setValue(""); // Reset the field value to an empty string
  };

  return {
    name,
    value,
    onChange,
    reset,
  };
};
