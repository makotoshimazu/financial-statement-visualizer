import { useState } from "react";

const useLocalStorage = <T extends object>(
  key: string,
  defaultValue: T,
): [T, (newValue: T) => void, (newKey: string) => void] => {
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
    (newKey: string) => {
      window.localStorage.setItem(newKey, JSON.stringify(value));
    },
  ];
};

export default useLocalStorage;
