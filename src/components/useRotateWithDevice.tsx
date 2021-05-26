import React, { useRef } from "react";
import { useDeviceOrientation, useMount } from "../utils/hooks";
import { Html } from "@react-three/drei";
import { useStore } from "../store";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function useRotateWithDevice() {
  const ref = useRef(null as any);
  const set = useStore((s) => s.set);
  const dOrient = useDeviceOrientation();
  const isSupported =
    typeof window !== "undefined" && window.DeviceOrientationEvent;
  useMount(() => {
    if (isSupported) {
      set({ isSpinning: false });
    }
  });

  // Z
  const alpha = THREE.Math.degToRad(dOrient.alpha);

  // X'
  const beta = THREE.Math.degToRad(dOrient.beta);

  // Y''
  const gamma = THREE.Math.degToRad(dOrient.gamma);

  const w = THREE.Math.degToRad(-90);

  // const { x, y, z } = Quat2Angle(alpha, beta, gamma, w);
  const [x, y, z] = [-beta, 0, alpha];

  useFrame(() => {
    if (!ref.current) {
      return;
    }
    ref.current.rotation.x = x;
    ref.current.rotation.y = y;
    ref.current.rotation.z = z;
  });

  const infoHtml = (
    <Html>
      {
        <div style={{ color: "white", overflowWrap: "anywhere", width: 160 }}>
          {Object.values(dOrient)
            .slice(1)
            .map((d) => Number(d).toFixed(0) + ",")}
        </div>
      }
    </Html>
  );

  return { x, y, z, ref, infoHtml };
}

function Quat2Angle(x, y, z, w) {
  let pitch, roll, yaw;

  const test = x * y + z * w;
  // singularity at north pole
  if (test > 0.499) {
    yaw = Math.atan2(x, w) * 2;
    pitch = Math.PI / 2;
    roll = 0;

    return new THREE.Vector3(pitch, roll, yaw);
  }

  // singularity at south pole
  if (test < -0.499) {
    yaw = -2 * Math.atan2(x, w);
    pitch = -Math.PI / 2;
    roll = 0;
    return new THREE.Vector3(pitch, roll, yaw);
  }

  const sqx = x * x;
  const sqy = y * y;
  const sqz = z * z;

  yaw = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz);
  pitch = Math.asin(2 * test);
  roll = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz);

  return new THREE.Vector3(pitch, roll, yaw);
}
