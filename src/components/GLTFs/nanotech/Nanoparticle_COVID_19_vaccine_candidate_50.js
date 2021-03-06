/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei/useGLTF";

export default function Model(props) {
  const group = useRef();
  const { nodes } = useGLTF(
    "/models/nanotech/nanoparticle_COVID_19_vaccine_candidate_50.glb"
  );
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        material={nodes["7b3ycif_assembly_1_B_Gaussian_surface"].material}
        geometry={nodes["7b3ycif_assembly_1_B_Gaussian_surface"].geometry}
      />
    </group>
  );
}

useGLTF.preload(
  "/models/nanotech/nanoparticle_COVID_19_vaccine_candidate_50.glb"
);
