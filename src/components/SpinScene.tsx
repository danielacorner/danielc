import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";

// const SPEED_X = 0.2;
const SPEED_Y = 0.1;
const AMPLITUDE_Y = 0.2;
// const AMPLITUDE_X = 0.7;
export default function SpinScene({ children }) {
  const ref = useRef(null as any);
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = -Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
      ref.current.rotation.y = ref.current.rotation.y + 0.0015;
    }
  });
  return <mesh ref={ref}>{children}</mesh>;
}
