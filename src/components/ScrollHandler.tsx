import * as React from "react";
import styled from "styled-components/macro";
import { useStore } from "../store";
import { CUSTOM_SCROLLBAR_CSS } from "../utils/cssSnippets";
import { useEventListener, useWindowSize } from "../utils/hooks";
import debounce from "lodash.debounce";

const HEIGHT_MULTIPLIER = 10;
export default function ScrollHandler({ children }) {
  const set = useStore((s) => s.set);
  const isScrollable = useStore((s) => s.isScrollable);
  const windowSize = useWindowSize();
  const [scrollY, setScrollY] = React.useState(0);
  const scrollRef = React.useRef(null as any);
  const handleWheel = debounce((event) => {
    if (!isScrollable) {
      return;
    }
    const maxY = windowSize.height * HEIGHT_MULTIPLIER;
    const newScrollY = Math.max(0, Math.min(maxY, scrollY - event.wheelDeltaY));
    set({
      scrollTopPct: newScrollY / maxY,
    });
    scrollRef.current.scrollTop = newScrollY;
    setScrollY(newScrollY);
  });

  useEventListener("wheel", handleWheel);

  return (
    <InvisibleScrollStyles>
      {children}
      <div className="scrollWrapper" ref={scrollRef}>
        <div className="scrollable" />
      </div>
    </InvisibleScrollStyles>
  );
}
const InvisibleScrollStyles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: hsla(0, 0%, 100%, 0);
  .scrollWrapper {
    ${CUSTOM_SCROLLBAR_CSS}
    overflow-x: hidden;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
    pointer-events: none;
    .scrollable {
      height: ${HEIGHT_MULTIPLIER * 100}vh;
      width: 100%;
    }
  }
`;
