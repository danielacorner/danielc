import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring/three";
import { useControl } from "react-three-gui";
import { useStore } from "../store";
import { useMount } from "../utils/hooks";
import { useTexture } from "@react-three/drei";

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

  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

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

  const [mounted, setMounted] = useState(false);
  useMount(() => {
    setMounted(true);
  });

  const scrollTopPct = useStore((s) => s.scrollTopPct);
  console.log("🌟🚨 ~ SpinningParticle ~ scrollTopPct", scrollTopPct);

  const zoomedIn = useStore((s) => s.isZoomed);
  const handleZoomIn = () => set({ isZoomed: true });

  const set = useStore((s) => s.set);
  useEffect(() => {
    set({ isSpinning: !zoomedIn });
  }, [zoomedIn]);

  const finalScale = useControl("finalScale", {
    type: "number",
    min: 0.1,
    max: 10,
    value: 4,
  });
  const scale = zoomedIn ? finalScale : mounted ? 1 : 0;

  const [isWireframe, setIsWireframe] = useState(false);

  const springProps = useSpring({
    scale: [scale, scale, scale],
    opacity: !zoomedIn ? 0.5 : 0.8,
    opacity2: !zoomedIn ? 0.2 : 0.8,
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
          opacity={springProps.opacity}
          transparent={true}
          depthTest={true}
          flatShading={true}
          roughness={0.4}
          vertexColors={true}
          reflectivity={1}
        />
      </animated.mesh>
      {/* octahedron */}
      <mesh ref={ref2}>
        <octahedronBufferGeometry args={[scalePct * 0.5, 0]} />
        <meshPhysicalMaterial
          opacity={0.4}
          transparent={true}
          depthTest={true}
          flatShading={true}
          roughness={0.4}
          vertexColors={true}
          reflectivity={1}
        />
      </mesh>
      {/* icosahedron */}
      <mesh ref={ref3}>
        <mesh>
          <icosahedronBufferGeometry args={[scalePct * 1, 0]} />
          <animated.meshPhysicalMaterial
            wireframe={false}
            opacity={springProps.opacity2}
            transparent={true}
            depthTest={true}
            flatShading={false}
            roughness={springProps.roughness}
            vertexColors={false}
            metalness={0.9}
            reflectivity={1}
          />
        </mesh>
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
          renderOrder={3}
          color="tomato"
          wireframe={isWireframe}
          opacity={isWireframe ? 0.05 : 0.08}
          transparent={true}
          depthTest={true}
          flatShading={true}
          roughness={0.4}
          vertexColors={true}
          reflectivity={1}
        />
      </mesh>
      <mesh ref={ref5}>
        <icosahedronBufferGeometry args={[scalePct * 14, 2]} />
        <meshPhysicalMaterial
          renderOrder={0}
          opacity={isWireframe ? 0.03 : 0.04}
          wireframe={true}
          transparent={true}
          depthTest={zoomedIn}
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
