import { Box, GizmoHelper, GizmoViewcube } from "@react-three/drei";
import React, { useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { useControl } from "react-three-gui";

export function Lighting() {
  return (
    <>
      <color attach="background" args={["#272727"] as any} />
      <LightFollowsMouse />
      {/* {process.env.NODE_ENV === "development" && <GizmoViewcube />} */}
      {/* <SpotLightOnSelectedProtein /> */}
      <ambientLight intensity={0.3} />
      <pointLight position={[-10, -10, -10]} intensity={1} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.5}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
    </>
  );
}
function LightFollowsMouse() {
  const light = useRef(null as any);
  const box = useRef(null as any);

  const { viewport, mouse } = useThree();

  // mouse.x goes from -1 -> 1
  // viewport.width ~= 20

  useFrame((state) => {
    const [x, y, z] = [
      mouse.x * viewport.width,
      mouse.y * viewport.height,
      // z goes from 0 -> -1 -> 0
      (Math.cos(Math.PI * mouse.x) * viewport.width) / 3,
    ];

    // Makes the light follow the mouse
    light.current?.position.set(x, y, z);
    if (process.env.NODE_ENV === "development") {
      box.current?.position.set(x, y, z);
    }
  });

  return (
    <>
      {/* // light that gets emitted in all directions */}
      <pointLight
        ref={light}
        decay={0}
        distance={0}
        intensity={6}
        color="lightblue"
      />
      {process.env.NODE_ENV === "development" && <Box ref={box} />}
    </>
  );
}
