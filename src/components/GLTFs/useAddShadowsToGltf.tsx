import { useMount } from "../../utils/hooks";

export function useAddShadowsToGltf(ref) {
  useMount(() => {
    ref.current?.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  });
}
