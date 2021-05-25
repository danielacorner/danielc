import { Html } from "@react-three/drei";
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
    value: 3.5,
  });
  const scale = zoomedIn ? finalScale : mounted ? 1 : 0;

  const springProps = useSpring({
    scale: [scale, scale, scale],
    opacity: !zoomedIn ? 0.5 : 0.8,
    config: {
      mass: 20,
      tension: zoomedIn ? 160 : 80,
      friction: zoomedIn ? 70 : 18,
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

  const dOrient = useDeviceOrientation();
  console.log("🌟🚨 ~ SpinningParticle ~ dOrient", dOrient);
  const isSupported = window.DeviceOrientationEvent;
  useMount(() => {
    if (isSupported) {
      set({ isSpinning: false });
    }
  });
  const hourOfDay = new Date().getHours();

  const degToRad = (deg) => (deg / 360) * Math.PI * 2;
  const [x, y, z] = [
    -degToRad(dOrient.beta),
    -degToRad(dOrient.alpha),
    -degToRad(dOrient.gamma),
  ];

  return (
    <animated.mesh
      scale={springProps.scale}
      onClick={handleZoomIn}
      onPointerDown={handleZoomIn}
      rotation={[x, y, z]}
    >
      <Html>
        {
          <div style={{ color: "white", overflowWrap: "anywhere", width: 160 }}>
            {Object.values(dOrient)
              .slice(1)
              .map((d) => Number(d).toFixed(0) + ",")}
          </div>
        }
      </Html>

      {/* zoomed in - solid object */}
      <animated.mesh ref={ref1}>
        <tetrahedronBufferGeometry args={[scalePct * 0.25, 0]} />
        <animated.meshPhysicalMaterial
          opacity={springProps.opacity}
          transparent={true}
          depthTest={false}
          flatShading={true}
          roughness={0.4}
          vertexColors={true}
          reflectivity={1}
        />
      </animated.mesh>
      {/* decorative transparent objects */}
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
          wireframe={false}
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
          renderOrder={0}
          opacity={0.1}
          wireframe={zoomedIn}
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
