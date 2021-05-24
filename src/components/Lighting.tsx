import React, { useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";

export function Lighting() {
  return (
    <>
      <color attach="background" args={["#272727"] as any} />
      <LightFollowsMouse />

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
  const { viewport, mouse } = useThree();

  useFrame((state) => {
    // Makes the light follow the mouse
    light.current?.position.set(
      (mouse.x * viewport.width) / 2,
      (mouse.y * viewport.height) / 2,
      0
    );
  });

  return (
    <pointLight ref={light} distance={60} intensity={0.2} color="lightblue" />
  );
}
