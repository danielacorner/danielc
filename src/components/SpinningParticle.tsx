import { Sky, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring/three";
import { useControl } from "react-three-gui";
import { useStore } from "../store";
import { useDeviceOrientation, useMount } from "../utils/hooks";

const SPEED_Y = 0.5;
const SPEED_X = 0.2;
const AMPLITUDE_Y = 1;
const AMPLITUDE_X_INV = 0.01;
export default function SpinningParticle() {
  const scalePct = 1;

  const ref1 = useRef(null as any);
  const ref2 = useRef(null as any);
  const ref3 = useRef(null as any);
  const ref4 = useRef(null as any);
  const ref5 = useRef(null as any);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (!ref1.current) {
      return;
    }
    ref1.current.rotation.x = -Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    ref1.current.rotation.y =
      ref1.current.rotation.y + Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;

    ref2.current.rotation.x = Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    ref2.current.rotation.y =
      ref2.current.rotation.y - Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;

    ref3.current.rotation.x = Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    ref3.current.rotation.y =
      ref3.current.rotation.y + Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;

    ref4.current.rotation.x = -Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    ref4.current.rotation.y =
      ref4.current.rotation.y - Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;

    ref5.current.rotation.x = -Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    ref5.current.rotation.y =
      ref5.current.rotation.y + Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;
  });

  const [mounted, setMounted] = useState(false);
  useMount(() => {
    setMounted(true);
  });

  const [zoomedIn, setZoomedIn] = useState(false);
  const handleZoomIn = () => setZoomedIn(true);

  const set = useStore((s) => s.set);
  useEffect(() => {
    set({ isSpinning: !zoomedIn });
  }, [zoomedIn]);

  console.log("🌟🚨 ~ SpinningParticle ~ zoomedIn", zoomedIn);

  const finalScale = useControl("finalScale", {
    type: "number",
    min: 0.1,
    max: 10,
    value: 5,
  });
  const scale = zoomedIn ? finalScale : mounted ? 1 : 0;

  const springProps = useSpring({
    scale: [scale, scale, scale],
    opacity: zoomedIn ? 0.9 : 0,
    config: {
      mass: 20,
      tension: zoomedIn ? 160 : 80,
      friction: 18,
      clamp: zoomedIn,
    },
    // // unmount the particle when it's fully decayed
    // onRest: (spring) => {
    //   const isDecayed = spring.scale[0] === 0;
    //   // TODO: if type === PROTEIN_TYPES.antibody
    //   // TODO: else if type === PROTEIN_TYPES.virus
    //   if (isDecayed) {
    //     if (type === PROTEIN_TYPES.virus) {
    //       incrementNumDefeatedViruses();
    //     }
    //     unmount();
    //   }
    // },
  });

  const deviceOrientation = useDeviceOrientation();
  console.log("🌟🚨 ~ SpinningParticle ~ deviceOrientation", deviceOrientation);

  const hourOfDay = new Date().getHours();
  const isDaytime = hourOfDay > 5 && hourOfDay <= 18;

  return (
    <animated.mesh
      scale={springProps.scale}
      onClick={handleZoomIn}
      onPointerDown={handleZoomIn}
    >
      <Stars />
      <Sky
        distance={450000}
        sunPosition={[0, isDaytime ? 1 : -1, 0]}
        inclination={0}
        azimuth={0.25}
        rayleigh={3}
        mieCoefficient={0.008}
        mieDirectionalG={0.063}
        turbidity={10}
      />
      {/* zoomed in - solid object */}
      <mesh renderOrder={3} transparent={true}>
        <dodecahedronBufferGeometry args={[scalePct * 1.5, 0]} />
        <animated.meshPhysicalMaterial
          transparent={true}
          opacity={springProps.opacity}
        />
      </mesh>
      {/* decorative transparent objects */}
      <mesh ref={ref1}>
        <tetrahedronBufferGeometry args={[scalePct * 0.25, 0]} />
        <meshPhysicalMaterial
          opacity={0.5}
          transparent={true}
          depthTest={false}
          flatShading={true}
          roughness={0.4}
          vertexColors={true}
          reflectivity={1}
        />
      </mesh>
      <mesh ref={ref2}>
        <octahedronBufferGeometry args={[scalePct * 0.5, 0]} />
        <meshPhysicalMaterial
          opacity={0.4}
          transparent={true}
          depthTest={false}
          flatShading={true}
          roughness={0.4}
          vertexColors={true}
          reflectivity={1}
        />
      </mesh>
      <mesh ref={ref3}>
        <icosahedronBufferGeometry args={[scalePct * 1, 0]} />
        <meshPhysicalMaterial
          wireframe={zoomedIn}
          opacity={0.4}
          transparent={true}
          depthTest={false}
          flatShading={true}
          roughness={0.4}
          vertexColors={true}
          reflectivity={1}
        />
      </mesh>
      <mesh ref={ref4}>
        <icosahedronBufferGeometry args={[scalePct * 4, 1]} />
        <meshPhysicalMaterial
          renderOrder={3}
          color="tomato"
          wireframe={zoomedIn}
          opacity={0.08}
          transparent={true}
          depthTest={false}
          flatShading={true}
          roughness={0.4}
          vertexColors={true}
          reflectivity={1}
        />
      </mesh>
      <mesh ref={ref5}>
        <icosahedronBufferGeometry args={[scalePct * 14, 2]} />
        <meshPhysicalMaterial
          renderOrder={3}
          opacity={0.04}
          transparent={true}
          depthTest={false}
          flatShading={true}
          roughness={0.4}
          vertexColors={true}
          reflectivity={1}
        />
      </mesh>
      <mesh>
        <icosahedronBufferGeometry args={[scalePct * 100, 5]} />
        <meshPhysicalMaterial
          color="rebeccapurple"
          opacity={0.018}
          transparent={true}
          depthTest={false}
          flatShading={true}
          roughness={0.4}
          vertexColors={true}
          reflectivity={1}
          wireframe={true}
        />
      </mesh>
      <mesh>
        <icosahedronBufferGeometry args={[scalePct * 600, 10]} />
        <meshPhysicalMaterial
          color="cornflowerblue"
          opacity={0.01}
          transparent={true}
          depthTest={false}
          flatShading={true}
          roughness={0.4}
          vertexColors={true}
          reflectivity={1}
          wireframe={true}
        />
      </mesh>
    </animated.mesh>
  );
}
