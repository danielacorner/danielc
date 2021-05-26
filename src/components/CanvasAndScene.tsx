import React from "react";
import { useWindowSize } from "../utils/hooks";
import * as THREE from "three";
import { Environment, Sky, Stars } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { Physics } from "@react-three/cannon";
import { PHYSICS_PROPS } from "./PHYSICS_PROPS";
import SpinScene from "./SpinScene";
import SpinningParticle from "./SpinningParticle";
import { Controls } from "react-three-gui";
import { ModifiedOrbitControls } from "./ModifiedOrbitControls";

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
      <Controls />
    </Controls.Provider>
  );
}

function Scene() {
  // const isDaytime = hourOfDay > 5 && hourOfDay <= 18;

  return (
    <>
      <ModifiedOrbitControls />
      <Stars count={1000} />
      <Environment
        background={false}
        // files={["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]}
        path={"/"}
        preset={"night"}
        scene={undefined} // adds the ability to pass a custom THREE.Scene
      />
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
