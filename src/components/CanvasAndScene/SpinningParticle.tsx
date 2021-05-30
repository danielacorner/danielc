import { useFrame, useLoader } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring/three";
import { useStore } from "../../store";
import { useMount } from "../../utils/hooks";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import D20 from "../GLTFs/D20";
import { useControl } from "react-three-gui";
import { useAnimationStep } from "./useAnimationStep";

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
  { x: degToRad(70.81), y: degToRad(0), z: degToRad(0) },
];

export default function SpinningParticle() {
  const scalePct = 1;

  const ref1 = useRef(null as any);
  const ref2 = useRef(null as any);
  const ref3 = useRef(null as any);
  const ref4 = useRef(null as any);
  const ref5 = useRef(null as any);

  const x = useControl("rotx", {
    type: "number",
    value: 70.81,
    min: 70,
    max: 72,
  });
  const y = useControl("roty", { type: "number", value: 0, min: 0, max: 90 });
  const z = useControl("rotz", { type: "number", value: 0, min: 0, max: 90 });
  const rotation = { x: degToRad(x), y: degToRad(y), z: degToRad(z) };
  const animationStep = useAnimationStep();
  const isD20Active = animationStep > 1;

  const opacity = useControl("opacity", {
    value: 0.78,
    type: "number",
    min: 0.04,
    max: 1,
  });
  const metalness = useControl("metalness", {
    value: 1,
    type: "number",
    min: 0,
    max: 10,
  });
  const roughness = useControl("roughness", {
    value: 0.07,
    type: "number",
    min: 0.0,
    max: 1,
  });
  // const rotation = useRotateWithScroll(x, y, z);

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
    opacityTetrahedron: !zoomedIn ? 0.8 : 0.8,
    opacityIcosahedron: !zoomedIn ? 0.2 : isD20Active ? 0.2 : 0.8,
    opacityD20: !zoomedIn ? 0.3 : isD20Active ? opacity : 0.2,
    opacityInnerIcosahedron: !zoomedIn ? 0 : isD20Active ? 0.9 : 0,
    metalnessD20: !zoomedIn ? 4 : isD20Active ? metalness : 30,
    roughnessD20: !zoomedIn ? 0.5 : isD20Active ? roughness : 0.07,
    roughness: !zoomedIn ? 0.4 : 0,
    config: {
      mass: 20,
      tension: zoomedIn ? 160 : 80,
      friction: zoomedIn ? 70 : 18,
      clamp: false,
    },
    onRest: (spring) => {
      if (zoomedIn) {
        setIsWireframe(true);
        set({ isScrollable: true });
      }
    },
  });

  const d20scale = 0.08;

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
          opacity={springProps.opacityTetrahedron}
          depthTest={true}
        />
      </animated.mesh>
      {/* octahedron */}
      <mesh ref={ref2}>
        <octahedronBufferGeometry args={[scalePct * 0.5, 0]} />
        <meshPhysicalMaterial
          {...COMMON_MATERIAL_PROPS}
          opacity={0.6}
          depthTest={true}
        />
      </mesh>
      {/* icosahedron + D20 */}
      <mesh ref={ref3} depthTest={true}>
        <mesh>
          <icosahedronBufferGeometry args={[scalePct * 1, 0]} />
          <animated.meshPhysicalMaterial
            {...COMMON_MATERIAL_PROPS}
            opacity={springProps.opacityIcosahedron}
            depthTest={false}
            flatShading={false}
            roughness={springProps.roughness}
            vertexColors={false}
            metalness={0.9}
            receiveShadow={true}
            castShadow={true}
          />
        </mesh>
        {/* TODO: need to fade in a non-transparent one too when isD20Active??? */}
        <D20
          scale={[d20scale, d20scale, d20scale]}
          rotation={[D20_ROTATION.x, D20_ROTATION.y, D20_ROTATION.z]}
          // rotation={[rotX, rotY, rotZ]}
          depthTest={true}
          depthWrite={true}
          receiveShadow={true}
          castShadow={true}
        >
          <animated.meshPhysicalMaterial
            {...COMMON_MATERIAL_PROPS}
            // transparent={true}
            depthTest={true}
            depthWrite={true}
            opacity={springProps.opacityD20}
            metalness={springProps.metalnessD20}
            roughness={springProps.roughnessD20}
            clearcoat={0.13}
            clearcoatRoughness={0.4}
            color="white"
          />
          {/* <meshStandardMaterial color="white" /> */}
          {/* <meshStandardMaterial map={texture} attach="material" /> */}
        </D20>
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

function useRotateWithScroll(x, y, z) {
  const animationStep = useAnimationStep();

  const [rotation, setRotation] = useState({
    x: degToRad(x),
    y: degToRad(y),
    z: degToRad(z),
  });
  useEffect(() => {
    setRotation(SIDES_ROTATIONS[animationStep] || SIDES_ROTATIONS[0]);
  }, [animationStep]);
  console.log("🌟🚨 ~ SpinningParticle ~ animationStep", animationStep);
  return rotation;
}
