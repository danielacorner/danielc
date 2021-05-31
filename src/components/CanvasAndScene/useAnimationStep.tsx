import { useEffect, useState } from "react";
import { useStore } from "../../store";
import { useLocalStorageState } from "../../utils/hooks";

const NUM_STEPS = 21;

export function useAnimationStep() {
  const [animationStep, setAnimationStep] = useLocalStorageState(
    "animationStep",
    0
  );
  const scrollTopPct = useStore((s) => s.scrollTopPct);

  // const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    setAnimationStep(Math.round(scrollTopPct * NUM_STEPS));
  }, [scrollTopPct]);

  return animationStep;
}
