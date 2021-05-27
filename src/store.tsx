import create from "zustand";

type VirusParticle = { id_str: string };

type GlobalStateType = {
  isZoomed: boolean;
  /** mute the music */
  isSoundOn: boolean;
  isSpinning: boolean;
  /** is the game paused / temperature === 0 */
  paused: boolean;
  /** if a property in the store is animating e.g. scale, can turn things on/off */
  isPropertyAnimating: boolean;
  scrollTopPct: number;
  viruses: VirusParticle[];
  createVirus: (newVir: VirusParticle) => any;
  set: (newState: any) => any;
};

export function getSettingsFromLS() {
  if (typeof window === "undefined") {
    return;
  }
  const settings = window.localStorage.getItem("settings");
  return JSON.parse(settings);
}

const initialIsSoundOn = (() => {
  const settings = getSettingsFromLS();
  return settings && "isSoundOn" in settings ? settings.isSoundOn : true;
})();

// zustand https://github.com/pmndrs/zustand
// with typescript https://react-tracked.js.org/docs/tutorial-zustand-01/
export const useStore = create<GlobalStateType>(
  (set): GlobalStateType => ({
    isSpinning: false,
    paused: false,
    isZoomed: true,
    // isZoomed: true,
    // isZoomed: true,
    // isZoomed: true,
    // isZoomed: true,
    // isZoomed: true,
    // isZoomed: true,
    isSoundOn: initialIsSoundOn,
    isPropertyAnimating: false,
    scrollTopPct: 0,
    viruses: [],
    createVirus: (newVir) =>
      set((state) => ({ viruses: [...state.viruses, newVir] })),
    set: (newState) => set((state) => ({ ...state, ...newState })),
  })
);
