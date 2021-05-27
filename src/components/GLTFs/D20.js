/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const group = useRef();
  const { nodes } = useGLTF("/models/D20.glb");
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        material={nodes.Mesh_0.material}
        geometry={nodes.Mesh_0.geometry}
        position={[0, 0, 0]}
      />
    </group>
  );
}
useGLTF.preload("/models/D20.glb");
