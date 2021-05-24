import React from "react";
import { useWindowSize } from "../utils/hooks";
// import * as THREE from "three";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { Physics } from "@react-three/cannon";
import { PHYSICS_PROPS } from "./PHYSICS_PROPS";
import SpinScene from "./SpinScene";
import SpinningParticle from "./SpinningParticle";

export default function CanvasAndScene() {
  const windowSize = useWindowSize();

  return (
    <Canvas
      onCreated={({ gl }) => {
        // gl.shadowMap.enabled = true;
        // gl.shadowMap.type = THREE.PCFShadowMap;
      }}
      gl={{ antialias: false, alpha: false }}
      {...{ camera: { fov: 75, position: [0, 0, 15] } }}
      style={{ height: windowSize.height, width: windowSize.width }}
    >
      <Lighting />
      <SpinScene>
        <OrbitControls />
        <Physics {...PHYSICS_PROPS}>
          <mesh scale={[1, 1, 1]}>
            <Scene />
          </mesh>
        </Physics>
      </SpinScene>
    </Canvas>
  );
}

function Scene() {
  return <SpinningParticle />;
}
