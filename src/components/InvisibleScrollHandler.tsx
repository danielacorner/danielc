import * as React from "react";
import styled from "styled-components/macro";
import { useStore } from "../store";
import { CUSTOM_SCROLLBAR_CSS } from "../utils/cssSnippets";
import { useWindowSize } from "../utils/hooks";

const HEIGHT_MULTIPLIER = 10;
export default function InvisibleScrollHandler() {
  const set = useStore((s) => s.set);
  const windowSize = useWindowSize();
  const handleScroll = (event) => {
    console.log(
      "🌟🚨 ~ handleScroll ~ event.target.scrollTop",
      event.target.scrollTop
    );
    console.log(
      "🌟🚨 ~ handleScroll ~ event.target.offsetHeight",
      event.target.offsetHeight
    );
    set({
      scrollTopPct:
        event.target.scrollTop / (windowSize.height * HEIGHT_MULTIPLIER),
    });
  };

  return (
    <InvisibleScrollStyles onScroll={handleScroll}>
      <div className="scrollHeight" />
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
  .scrollHeight {
    height: ${HEIGHT_MULTIPLIER * 100}vh;
  }
`;
