import React from "react";
import { useWindowSize } from "../utils/hooks";
// import * as THREE from "three";
import { Sky, Stars } from "@react-three/drei";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { Physics } from "@react-three/cannon";
import { PHYSICS_PROPS } from "./PHYSICS_PROPS";
import SpinScene from "./SpinScene";
import SpinningParticle from "./SpinningParticle";
import { Controls } from "react-three-gui";

export default function CanvasAndScene() {
  const windowSize = useWindowSize();
  return (
    <Controls.Provider>
      <Controls.Canvas
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
          {process.env.NODE_ENV === "development" && <OrbitControls />}
          <Physics {...PHYSICS_PROPS}>
            <mesh scale={[1, 1, 1]}>
              <Scene />
            </mesh>
          </Physics>
        </SpinScene>
      </Controls.Canvas>
      <Controls />
    </Controls.Provider>
  );
}

function Scene() {
  const isDaytime = false;
  // const isDaytime = hourOfDay > 5 && hourOfDay <= 18;

  return (
    <>
      <Stars count={1000} />
      <Sky
        distance={450000}
        sunPosition={[0, isDaytime ? 1 : -1, 0]}
        inclination={0}
        azimuth={0.25}
        rayleigh={20}
        mieCoefficient={0.008}
        mieDirectionalG={0.063}
        turbidity={10}
      />
      <SpinningParticle />
    </>
  );
}
