import { useFrame, useLoader } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring/three";
import { useStore } from "../store";
import { useMount } from "../utils/hooks";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import D20 from "./GLTFs/D20";
import { useControl } from "react-three-gui";

const SPEED_Y = 0.5;
const SPEED_X = 0.2;
const AMPLITUDE_Y = 1;
const AMPLITUDE_X_INV = 0.01;

const COMMON_MATERIAL_PROPS = {
  transparent: true,
  wireframe: false,
  depthTest: false,
  flatShading: true,
  roughness: 0.4,
  vertexColors: true,
  reflectivity: 1,
};

const degToRad = THREE.Math.degToRad;
const radToDeg = THREE.Math.radToDeg;

const D20_ROTATION = {
  x: degToRad(-0.87),
  y: degToRad(57.6),
  z: degToRad(54.8),
};

// rotate the icosahedron to each face, with the triangle pointing down
const SIDES_ROTATIONS = [
  { x: degToRad(70.81), y: degToRad(0), z: degToRad(0) },
];

export default function SpinningParticle() {
  const scalePct = 1;

  const ref1 = useRef(null as any);
  const ref2 = useRef(null as any);
  const ref3 = useRef(null as any);
  const ref4 = useRef(null as any);
  const ref5 = useRef(null as any);

  const x = useControl("x", { type: "number", value: 70.81, min: 70, max: 72 });
  const y = useControl("y", { type: "number", value: 0, min: 0, max: 90 });
  const z = useControl("z", { type: "number", value: 0, min: 0, max: 90 });
  const rotation = { x: degToRad(x), y: degToRad(y), z: degToRad(z) };
  // const [rotation, setRotation] = useState({
  //   x: degToRad(x),
  //   y: degToRad(y),
  //   z: degToRad(z),
  // });

  const animationStep = useAnimationStep();
  // useEffect(() => {
  //   setRotation({ x: animationStep, y: 1, z: 0 });
  // }, [animationStep]);
  console.log("🌟🚨 ~ SpinningParticle ~ animationStep", animationStep);

  const zoomedIn = useStore((s) => s.isZoomed);

  useSpinObjects(ref1, ref2, zoomedIn, ref3, rotation, ref4, ref5);

  const [mounted, setMounted] = useState(false);
  useMount(() => {
    setMounted(true);
  });

  const handleZoomIn = () => set({ isZoomed: true });

  const set = useStore((s) => s.set);
  useEffect(() => {
    set({ isSpinning: !zoomedIn });
  }, [zoomedIn]);

  const scale = zoomedIn ? 4.5 : mounted ? 1 : 0;

  const [isWireframe, setIsWireframe] = useState(false);

  const springProps = useSpring({
    scale: [scale, scale, scale],
    opacity: !zoomedIn ? 0.5 : 0.8,
    opacity2: !zoomedIn ? 0.2 : 0.8,
    opacityD20: !zoomedIn ? 0 : 0.2,
    roughness: !zoomedIn ? 0.4 : 0,
    config: {
      mass: 20,
      tension: zoomedIn ? 160 : 80,
      friction: zoomedIn ? 70 : 18,
      clamp: false,
    },
    // // unmount the particle when it's fully decayed
    onRest: (spring) => {
      if (zoomedIn) {
        setIsWireframe(true);
        set({ isScrollable: true });
      }
    },
    // onRest: (spring) => {
    //     unmount();
    //   }
    // },
  });

  const twentyTextures = useTexture(
    [...Array(20)].map((_, idx) => `https://picsum.photos/5${idx % 10}/50`)
  );
  // const [texture1] = useTexture(["/textures/dice_1.jpeg"]);

  // const rotXDeg = useControl("rotX", {
  //   value: D20_ROTATION.x,
  //   type: "number",
  //   min: -10,
  //   max: 10,
  // });
  // const rotX = degToRad(rotXDeg);

  // const rotYDeg = useControl("rotY", {
  //   value: D20_ROTATION.y,
  //   type: "number",
  //   min: 50,
  //   max: 60,
  // });
  // const rotY = degToRad(rotYDeg);

  // const rotZDeg = useControl("rotZ", {
  //   value: D20_ROTATION.z,
  //   type: "number",
  //   min: 50,
  //   max: 60,
  // });
  // const rotZ = degToRad(rotZDeg);

  const d20scale = useControl("d20scale", {
    value: 0.08,
    type: "number",
    min: 0.04,
    max: 0.16,
  });
  // const texture = useLoader(THREE.TextureLoader, [
  //   `https://picsum.photos/50/50`,
  // ]);
  // const texture = useTexture([`https://picsum.photos/50/50`]);
  // const opacity = useControl("opacity", {
  //   value: 0.3,
  //   type: "number",
  //   min: 0.04,
  //   max: 0.94,
  // });
  // const metalness = useControl("metalness", {
  //   value: 123.33,
  //   type: "number",
  //   min: 0,
  //   max: 1000,
  // });
  // const roughness = useControl("roughness", {
  //   value: 0.07,
  //   type: "number",
  //   min: 0.0,
  //   max: 1,
  // });
  return (
    <animated.mesh
      scale={springProps.scale}
      onClick={handleZoomIn}
      onPointerDown={handleZoomIn}
    >
      {/* tetrahedron */}
      <animated.mesh ref={ref1}>
        <tetrahedronBufferGeometry args={[scalePct * 0.25, 0]} />
        <animated.meshPhysicalMaterial
          {...COMMON_MATERIAL_PROPS}
          opacity={springProps.opacity}
          depthTest={true}
        />
      </animated.mesh>
      {/* octahedron */}
      <mesh ref={ref2}>
        <octahedronBufferGeometry args={[scalePct * 0.5, 0]} />
        <meshPhysicalMaterial
          {...COMMON_MATERIAL_PROPS}
          opacity={0.4}
          depthTest={true}
        />
      </mesh>
      {/* icosahedron */}
      <mesh ref={ref3}>
        <mesh>
          <icosahedronBufferGeometry args={[scalePct * 1, 0]} />
          <animated.meshPhysicalMaterial
            {...COMMON_MATERIAL_PROPS}
            opacity={springProps.opacity2}
            depthTest={true}
            flatShading={false}
            roughness={springProps.roughness}
            vertexColors={false}
            metalness={0.9}
          />
        </mesh>
        <D20
          scale={[d20scale, d20scale, d20scale]}
          rotation={[D20_ROTATION.x, D20_ROTATION.y, D20_ROTATION.z]}
          // rotation={[rotX, rotY, rotZ]}
        >
          <animated.meshStandardMaterial
            {...COMMON_MATERIAL_PROPS}
            transparent={true}
            opacity={springProps.opacityD20}
            metalness={123.33}
            roughness={0.07}
          />
          {/* <meshStandardMaterial map={texture} attach="material" /> */}
        </D20>
        {/* <mesh>
          <icosahedronBufferGeometry args={[scalePct * 1.02, 0]} />
          {twentyTextures.map((texture) => (
            <meshStandardMaterial map={texture} attach="material" />
          ))}
        </mesh> */}
      </mesh>
      <mesh ref={ref4}>
        <icosahedronBufferGeometry args={[scalePct * 4, 1]} />
        <meshPhysicalMaterial
          {...COMMON_MATERIAL_PROPS}
          renderOrder={3}
          color="tomato"
          wireframe={isWireframe}
          opacity={isWireframe ? 0.05 : 0.08}
          depthTest={true}
        />
      </mesh>
      <mesh ref={ref5}>
        <icosahedronBufferGeometry args={[scalePct * 14, 2]} />
        <meshPhysicalMaterial
          {...COMMON_MATERIAL_PROPS}
          renderOrder={0}
          opacity={isWireframe ? 0.03 : 0.04}
          wireframe={true}
          depthTest={zoomedIn}
        />
      </mesh>
      <mesh>
        <icosahedronBufferGeometry args={[scalePct * 100, 5]} />
        <meshPhysicalMaterial
          {...COMMON_MATERIAL_PROPS}
          color="rebeccapurple"
          opacity={0.018}
          wireframe={true}
        />
      </mesh>
      <mesh>
        <icosahedronBufferGeometry args={[scalePct * 600, 10]} />
        <meshPhysicalMaterial
          {...COMMON_MATERIAL_PROPS}
          color="cornflowerblue"
          opacity={0.01}
          wireframe={true}
        />
      </mesh>
    </animated.mesh>
  );
}

const NUM_STEPS = 20;

function useSpinObjects(
  ref1: React.MutableRefObject<any>,
  ref2: React.MutableRefObject<any>,
  zoomedIn: boolean,
  ref3: React.MutableRefObject<any>,
  rotation: { x: any; y: number; z: number },
  ref4: React.MutableRefObject<any>,
  ref5: React.MutableRefObject<any>
) {
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

    if (zoomedIn) {
      // move slowly from [x,y,z] to rotation
      // e.g. 5 -> 2
      // 5 = 5 + (2-5)/2
      ref3.current.rotation.x =
        ref3.current.rotation.x + (rotation.x - ref3.current.rotation.x) / 20;
      ref3.current.rotation.y =
        ref3.current.rotation.y + (rotation.y - ref3.current.rotation.y) / 20;
      ref3.current.rotation.z =
        ref3.current.rotation.z + (rotation.z - ref3.current.rotation.z) / 20;
    } else {
      ref3.current.rotation.x = Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
      ref3.current.rotation.y =
        ref3.current.rotation.y + Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;
    }

    ref4.current.rotation.x = -Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    ref4.current.rotation.y =
      ref4.current.rotation.y - Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;

    ref5.current.rotation.x = -Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    ref5.current.rotation.y =
      ref5.current.rotation.y + Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;
  });
}

function useAnimationStep() {
  const scrollTopPct = useStore((s) => s.scrollTopPct);

  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    setAnimationStep(Math.round(scrollTopPct * NUM_STEPS));
  }, [scrollTopPct]);

  return animationStep;
}
