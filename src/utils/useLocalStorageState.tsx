// source: https://github.com/kentcdodds/react-hooks/blob/main/src/utils.js
import * as React from "react";

/**
 *
 * @param {String} key The key to set in localStorage for this value
 * @param {Object} defaultValue The value to use if it is not already in localStorage
 * @param {{serialize: Function, deserialize: Function}} options The serialize and deserialize functions to use (defaults to JSON.stringify and JSON.parse respectively)
 */

export function useLocalStorageState(
  key: string,
  defaultValue: any = "",
  { serialize = JSON.stringify, deserialize = JSON.parse }: any = {}
) {
  const [state, setState] = React.useState(() => {
    const value =
      typeof defaultValue === "function" ? defaultValue() : defaultValue;
    if (typeof window === "undefined") {
      return value;
    }
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage);
    }
    return value;
  });

  const prevKeyRef = React.useRef(key);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState];
}
