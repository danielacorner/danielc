import { useThree } from "react-three-fiber";
import { CubeTextureLoader } from "three";

// Loads the skybox texture and applies it to the scene.
export default function SkyBox() {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([
    "https://6izyu.csb.app/4b.jpg",
    "https://6izyu.csb.app/3.jpg",
    "https://6izyu.csb.app/4b.jpg",
    "https://6izyu.csb.app/4.jpg",
    "https://6izyu.csb.app/5.jpg",
    "https://6izyu.csb.app/2.jpg",
  ]);
  // Set the scene background property to the resulting texture.
  scene.background = texture;
  return null;
}
