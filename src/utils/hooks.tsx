import { useState, useEffect, useRef, EffectCallback } from "react";

function getIsSSR() {
  return typeof window === "undefined";
}

// https://hooks-guide.netlify.app/rehooks/useDeviceOrientation
export function useDeviceOrientation() {
  const [deviceOrientation, setDeviceOrientation] = useState({
    absolute: false,
    alpha: null as number | null,
    beta: null as number | null,
    gamma: null as number | null,
  });

  function handleDeviceOrientation(event) {
    setDeviceOrientation({
      absolute: event.absolute,
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    });
  }

  useEffect(() => {
    window.addEventListener("deviceorientation", handleDeviceOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  return deviceOrientation;
}

export function useWindowSize() {
  const isSSR = getIsSSR();

  // (For SSR apps only?) Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useMount(() => {
    if (isSSR) {
      return;
    }
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  });

  return windowSize;
}

export function useMount(cb: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(cb, []);
}

export const usePrevious = (value) => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
    return () => {
      ref.current = undefined;
    };
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

export const usePreviousIf = (value, condition: boolean) => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    if (condition) {
      ref.current = value;
    }
    return () => {
      // if (condition) {
      //   ref.current = undefined;
      // }
    };
  }, [value, condition]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

// https://usehooks.com/useEventListener/
/** Create an event listener on an element or the window. Self-cleaning! ✨
 * @param eventName event type e.g. "click", "mousemove" etc
 * @param handler callback function for event listener
 * @param [element] element to listen on (default = window)
 */
export function useEventListener(
  eventName: string,
  handler: Function,
  el?: Element | Window
) {
  const element = el ? el : typeof window === "undefined" ? null : window;
  // Create a ref that stores handler
  const savedHandler = useRef(null as Function | null);

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element?.addEventListener;
      if (!isSupported) {
        return;
      }

      // Create event listener that calls handler function stored in ref
      const eventListener = (event) =>
        savedHandler.current ? savedHandler.current(event) : null;

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
}

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// https://github.com/Hermanya/use-interval/blob/master/src/index.tsx
// * not set up to work with delay = 0
/**
 * a dynamic setInterval
 *
 * @param callback function to call on the interval
 * @param delay milliseconds between each call
 * @param immediate should call the callback right away?
 */
export const useInterval = ({
  callback,
  delay,
  immediate = false /* called when mounted if true */,
}: {
  callback: () => void;
  delay: number | null | false;
  immediate: boolean;
}) => {
  const savedCallback = useRef(null as Function | null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
    return () => {
      savedCallback.current = null;
    };
  }, [callback]);

  // Execute callback if immediate is set & delay exists.
  const firstDelayRef = useRef(delay);
  useEffect(() => {
    if (immediate && firstDelayRef.current && savedCallback.current) {
      savedCallback.current();
    }
  }, [immediate]);

  // Set up the interval.
  useEffect(() => {
    if (!delay) {
      return undefined;
    }

    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    let intervalId;

    if (delay !== null) {
      intervalId = setInterval(tick, delay);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [delay]);
};

// source: https://github.com/kentcdodds/react-hooks

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
  const [state, setState] = useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage);
    }
    return typeof defaultValue === "function"
      ? (defaultValue as Function)()
      : defaultValue;
  });

  const prevKeyRef = useRef(key);

  useEffect(() => {
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
