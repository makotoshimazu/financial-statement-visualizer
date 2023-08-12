import { useState } from "react";

const useLocalStorage = <T extends object>(
  key: string,
  defaultValue: T,
): [T, (newValue: T) => void] => {
  const serialized = window.localStorage.getItem(key);
  const object = Object.assign(
    structuredClone(defaultValue),
    JSON.parse(serialized ?? "{}"),
  );
  const [value, setValue] = useState(object);
  return [
    value,
    (newValue: T) => {
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    },
  ];
};

export default useLocalStorage;
