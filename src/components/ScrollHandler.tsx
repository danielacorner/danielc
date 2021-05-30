import * as React from "react";
import styled from "styled-components/macro";
import { useStore } from "../store";
import { CUSTOM_SCROLLBAR_CSS } from "../utils/cssSnippets";
import { useEventListener, useWindowSize } from "../utils/hooks";

const HEIGHT_MULTIPLIER = 10;
export default function ScrollHandler({ children }) {
  const set = useStore((s) => s.set);
  const isScrollable = useStore((s) => s.isScrollable);
  const windowSize = useWindowSize();
  const [scrollY, setScrollY] = React.useState(0);
  const scrollRef = React.useRef(null as any);
  const handleWheel = (event) => {
    if (!isScrollable) {
      return;
    }
    const maxY = windowSize.height * HEIGHT_MULTIPLIER;
    const newScrollY = Math.max(maxY, scrollY + event.wheelDeltaY);
    set({
      scrollTopPct: newScrollY / maxY,
    });
    scrollRef.current.scrollTop = newScrollY;
    setScrollY(newScrollY);
    console.log("🌟🚨 ~ handleWheel ~ scrollY", scrollY);
    console.log(
      "🌟🚨 ~ handleWheel ~ scrollRef.current.scrollTop",
      scrollRef.current.scrollTop
    );
  };

  useEventListener("wheel", handleWheel);

  return (
    <InvisibleScrollStyles>
      {children}
      <div className="scrollWrapper">
        <div className="scrollable" ref={scrollRef} />
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
  ${CUSTOM_SCROLLBAR_CSS}
  .scrollWrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
    pointer-events: none;
    .scrollable {
      height: ${HEIGHT_MULTIPLIER * 100}vh;
    }
  }
`;
