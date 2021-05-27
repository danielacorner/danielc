import React from "react";
import { useWindowSize } from "../utils/hooks";
import * as THREE from "three";
import { Environment, OrbitControls, Sky, Stars } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { Physics } from "@react-three/cannon";
import { PHYSICS_PROPS } from "./PHYSICS_PROPS";
import SpinScene from "./SpinScene";
import SpinningParticle from "./SpinningParticle";
import { Controls } from "react-three-gui";
import { DeviceOrientationOrbitControls } from "./DeviceOrientationOrbitControls";

export default function CanvasAndScene() {
  const windowSize = useWindowSize();

  return (
    <Controls.Provider>
      <Controls.Canvas
        onCreated={({ gl }) => {
          if (typeof window !== "undefined") {
            gl.setPixelRatio(window.devicePixelRatio);
          }
          // gl.outputEncoding = sRGBEncoding;
          gl.physicallyCorrectLights = true;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        }}
        gl={{ antialias: false, alpha: false }}
        {...{ camera: { fov: 75, position: [0, 0, 15] } }}
        style={{ height: windowSize.height, width: windowSize.width }}
      >
        <Lighting />
        <SpinScene>
          <Physics {...PHYSICS_PROPS}>
            <mesh scale={[1, 1, 1]}>
              <Scene />
            </mesh>
          </Physics>
        </SpinScene>
      </Controls.Canvas>
      {process.env.NODE_ENV !== "production" && <Controls />}
    </Controls.Provider>
  );
}

function Scene() {
  // const isDaytime = hourOfDay > 5 && hourOfDay <= 18;

  return (
    <>
      {process.env.NODE_ENV === "development" ? (
        <OrbitControls />
      ) : (
        <DeviceOrientationOrbitControls />
      )}
      <Stars count={1000} />
      <Environment background={false} path={"/"} preset={"night"} />
      <Sky
        rayleigh={7}
        mieCoefficient={0.1}
        mieDirectionalG={1}
        turbidity={10}
      />
      <SpinningParticle />
    </>
  );
}
