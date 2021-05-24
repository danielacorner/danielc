import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import { useSpring, animated } from "react-spring/three";
import { useControl } from "react-three-gui";
import { useMount } from "../utils/hooks";

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

  console.log("🌟🚨 ~ SpinningParticle ~ zoomedIn", zoomedIn);

  const finalScale = useControl("finalScale", {
    type: "number",
    min: 3,
    max: 100,
    value: 10,
  });
  const scale = zoomedIn ? finalScale : mounted ? 1 : 0;

  const springProps = useSpring({
    scale: [scale, scale, scale],
    config: {
      mass: 20,
      tension: 30,
      friction: 14,
      clamp: false,
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

  return (
    <animated.mesh
      scale={springProps.scale}
      onClick={handleZoomIn}
      onPointerDown={handleZoomIn}
    >
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
          // wireframe={true}
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
          color="tomato"
          // wireframe={true}
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
