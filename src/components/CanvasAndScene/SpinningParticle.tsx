import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring/three";
import { useStore } from "../../store";
import { useMount } from "../../utils/hooks";
import * as THREE from "three";
import D20_STAR from "../GLTFs/D20_star";
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
  depthTest: true,
  flatShading: false,
  roughness: 0.4,
  vertexColors: false,
  reflectivity: 1,
};

const degToRad = THREE.Math.degToRad;
const radToDeg = THREE.Math.radToDeg;

const D20_ROTATION = {
  x: degToRad(-0.87),
  y: degToRad(57.6),
  z: degToRad(54.8),
};
const D20_STAR_ROTATION = {
  x: degToRad(69.03),
  y: degToRad(-0.02),
  z: degToRad(-0.2),
};

// rotate the icosahedron to each face, from 20 to 1
const SIDES_ROTATIONS_DEG = [
  { x: 88.8, y: 224.4, z: 252 }, // 20
  { x: 224.4, y: 144, z: 254.4 }, // 19
  { x: 349.2, y: 163.2, z: 25.2 }, // 18
  { x: 309.6, y: 27.6, z: 296.4 }, // 17
  { x: 349.2, y: 16.8, z: 33.6 }, // 16
  { x: 129.6, y: 30, z: 108 }, // 15
  { x: 66, y: 271.2, z: 271.2 }, // 14
  { x: 42, y: 150, z: 66 }, // 13
  { x: 50.4, y: 230.4, z: 152.4 }, // 12
  { x: 240.4, y: 304.8, z: 146.4 }, // 11
  { x: 230.4, y: 235.2, z: 326.4 }, // 10
  { x: 230.4, y: 232.8, z: 146.4 }, // 9
  { x: 42, y: 30, z: 252 }, // 8
  { x: 42, y: 271.2, z: 63.6 }, // 7
  { x: 302.4, y: 21.6, z: 118.8 }, // 6
  { x: 163.2, y: 16.8, z: 30 }, // 5
  { x: 307.2, y: 146.4, z: 110.4 }, // 4
  { x: 340.8, y: 19.2, z: 213.6 }, // 3
  { x: 224.4, y: 30, z: 69.6 }, // 2
  { x: 268.8, y: 30, z: 246 }, // 1
];

const SIDES_ROTATIONS = SIDES_ROTATIONS_DEG.map((xyz) =>
  Object.fromEntries(
    Object.entries(xyz).map(([x, degrees]) => [x, degToRad(degrees)])
  )
);

export default function SpinningParticle() {
  const scalePct = 1;

  const ref1 = useRef(null as any);
  const ref2 = useRef(null as any);
  const ref3 = useRef(null as any);
  const ref4 = useRef(null as any);
  const ref5 = useRef(null as any);

  const x = useControl("rotx", {
    type: "number",
    value: 69.03,
    min: 0,
    max: 360,
  });
  const y = useControl("roty", {
    type: "number",
    value: -0.02,
    min: 0,
    max: 360,
  });
  const z = useControl("rotz", {
    type: "number",
    value: -0.2,
    min: 0,
    max: 360,
  });

  const isZoomed = useStore((s) => s.isZoomed);

  const isD20Active = useIsD20Active();
  // const rotation = { x: degToRad(x), y: degToRad(y), z: degToRad(z) };

  useSpinObjects(ref1, ref2, ref3, ref4, ref5);

  // const opacity = useControl("opacity", { // ? not working
  //   value: 0.78,
  //   type: "number",
  //   min: 0.04,
  //   max: 1,
  // });
  const metalness = useControl("metalness", {
    value: 0.99,
    type: "number",
    min: 0.5,
    max: 1,
  });
  const roughness = useControl("roughness", {
    value: 0.15,
    type: "number",
    min: 0.0,
    max: 1,
  });

  const [mounted, setMounted] = useState(false);
  useMount(() => {
    setMounted(true);
  });

  const handleZoomIn = () => set({ isZoomed: true });

  const set = useStore((s) => s.set);
  useEffect(() => {
    set({ isSpinning: !isZoomed });
  }, [isZoomed]);

  const scale = isZoomed ? 4.5 : mounted ? 1 : 0;

  const [isWireframe, setIsWireframe] = useState(false);

  const springProps = useSpring({
    scale: [scale, scale, scale],
    opacityTetrahedron: !isZoomed ? 0.8 : 0.8,
    opacityIcosahedron: !isZoomed ? 0.2 : isD20Active ? 0.2 : 0.8,
    opacityD20: !isZoomed ? 0.2 : isD20Active ? 0.8 : 0.2,
    opacityInnerIcosahedron: !isZoomed ? 0 : isD20Active ? 0.9 : 0,
    metalnessD20: !isZoomed ? 4 : isD20Active ? metalness : 30,
    roughnessD20: !isZoomed ? 0.5 : isD20Active ? roughness : 0.07,
    roughness: !isZoomed ? 0.4 : 0,
    config: {
      mass: 20,
      tension: isZoomed ? 160 : 80,
      friction: isZoomed ? 70 : 18,
      clamp: false,
    },
    onRest: (spring) => {
      if (isZoomed) {
        setIsWireframe(true);
        set({ isScrollable: true });
      }
    },
  });

  const d20Scale = 0.08;
  const d20StarScale = 0.055;

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
            roughness={springProps.roughness}
            metalness={0.9}
            receiveShadow={true}
            castShadow={true}
          />
        </mesh>
        {/* TODO: need to fade in a non-transparent one too when isD20Active??? */}
        {/* <D20
          scale={[d20Scale, d20Scale, d20Scale]}
          rotation={[D20_ROTATION.x, D20_ROTATION.y, D20_ROTATION.z]}
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
        </D20> */}
        <D20_STAR
          scale={[d20StarScale, d20StarScale, d20StarScale]}
          rotation={[
            D20_STAR_ROTATION.x,
            D20_STAR_ROTATION.y,
            D20_STAR_ROTATION.z,
          ]}
        >
          <animated.meshPhysicalMaterial
            {...COMMON_MATERIAL_PROPS}
            transparent={!isD20Active}
            depthTest={isD20Active}
            castShadow={true}
            depthWrite={true}
            opacity={springProps.opacityD20}
            metalness={springProps.metalnessD20}
            roughness={springProps.roughnessD20}
            clearcoat={0.73}
            clearcoatRoughness={0.4}
            color="silver"
          />
        </D20_STAR>
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
          depthTest={isZoomed}
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
  ref3: React.MutableRefObject<any>,
  ref4: React.MutableRefObject<any>,
  ref5: React.MutableRefObject<any>
) {
  const isZoomed = useStore((s) => s.isZoomed);
  const isD20Active = useIsD20Active();
  const rotation = useRotateWithScroll();

  const speedRotate = isD20Active ? 0.08 : 0.05;

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

    if (isZoomed) {
      // move slowly from [x,y,z] to rotation
      // e.g. 5 -> 2
      // 5 = 5 + (2-5)/2
      ref3.current.rotation.x =
        ref3.current.rotation.x +
        (rotation.x - ref3.current.rotation.x) * speedRotate;
      ref3.current.rotation.y =
        ref3.current.rotation.y +
        (rotation.y - ref3.current.rotation.y) * speedRotate;
      ref3.current.rotation.z =
        ref3.current.rotation.z +
        (rotation.z - ref3.current.rotation.z) * speedRotate;
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

function useRotateWithScroll() {
  const animationStep = useAnimationStep();

  const [rotation, setRotation] = useState(SIDES_ROTATIONS[0]);

  useEffect(() => {
    setRotation(SIDES_ROTATIONS[animationStep - 1] || SIDES_ROTATIONS[0]);
  }, [animationStep]);

  console.log("🌟🚨 ~ SpinningParticle ~ animationStep", animationStep);
  return rotation as { x: number; y: number; z: number };
}

function useIsD20Active() {
  const animationStep = useAnimationStep();
  return animationStep > 0;
}
