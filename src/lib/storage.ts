import { useState } from "react";

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const serialized = window.localStorage.getItem(key);
  const object = serialized === null ? defaultValue : JSON.parse(serialized)
  const [value, setValue] = useState(object)
  return [value, (newValue: T) => {
    window.localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue)
  }]
}
