import { Box, GizmoHelper, GizmoViewcube } from "@react-three/drei";
import React, { useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { useControl } from "react-three-gui";
import { useAnimationStep } from "./CanvasAndScene/useAnimationStep";
import { useSpring, animated } from "react-spring/three";
import { useStore } from "../store";

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
  const spotlightRef = useRef(null as any);
  const box = useRef(null as any);
  const spotlightBox = useRef(null as any);
  const isZoomed = useStore((s) => s.isZoomed);

  const { viewport, mouse } = useThree();

  // mouse.x goes from -1 -> 1
  // viewport.width ~= 20

  useFrame((state) => {
    const [x, y, z] = [
      mouse.x * viewport.width,
      mouse.y * viewport.height,
      // z goes from 0 -> -1 -> 0
      Math.cos(Math.PI * mouse.x) * viewport.width * 0.8,
    ];

    const [sx, sy, sz] = [mouse.x * 4, mouse.y * 4, 8];
    // Makes the light follow the mouse

    //
    spotlightRef.current?.position.set(sx, sy, sz);
    spotlightRef.current?.lookAt(0, 0, 0);
    if (process.env.NODE_ENV === "development") {
      spotlightBox.current?.position.set(sx, sy, sz);
    }

    light.current?.position.set(x, y, z);
    if (process.env.NODE_ENV === "development") {
      box.current?.position.set(x, y, z);
    }
  });

  const animationStep = useAnimationStep();
  const isD20Active = animationStep > 0;

  // const spotInt = useControl("spotInt", {
  //   type: "number",
  //   min: -100,
  //   max: 200,
  //   value: 50,
  // });

  const springProps = useSpring({
    spotlightIntensity: isD20Active ? 50 : -15,
    pointlightIntensity: !isZoomed ? 3 : 6,
  });
  const z = useControl("z", { type: "number", min: -10, max: 5, value: 0 });
  return (
    <>
      {/* // pointlight = light that gets emitted in all directions */}
      <animated.pointLight
        ref={light} /* this one follows the mouse */
        decay={0}
        distance={0}
        intensity={springProps.pointlightIntensity}
        color="white"
      />
      <pointLight
        decay={0}
        distance={0}
        intensity={1}
        color="lightblue"
        position={[-2, -8, 5]}
      />
      <pointLight
        decay={0}
        distance={0}
        intensity={3}
        color="red"
        position={[1, 8, -5]}
      />
      <pointLight
        decay={0}
        distance={0}
        intensity={2}
        color="limegreen"
        position={[3, -8, -6]}
      />
      <animated.spotLight
        intensity={springProps.spotlightIntensity}
        // angle={Math.PI / 2}
        ref={spotlightRef}
        castShadow={true}
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
        color="white"
      />
      <mesh depthTest={true}>
        {process.env.NODE_ENV === "development" && <Box ref={box} />}
        {process.env.NODE_ENV === "development" && (
          <Box position={spotlightBox} />
        )}
      </mesh>
    </>
  );
}
