import * as React from "react";
import Layout from "../components/Layout";
import styled from "styled-components/macro";
import CanvasAndScene from "../components/CanvasAndScene";
// import { useStore } from "../store";
// import InvisibleScrollHandler from "../components/InvisibleScrollHandler";

export default function IndexPage() {
  return (
    <Layout>
      <title>Daniel C</title>
      Hellooo
      <Background />
    </Layout>
  );
}

function Background() {
  // const isScrollable = useStore((s) => s.isScrollable);
  return (
    <BackgroundStyles>
      <CanvasAndScene />
      {/* {isScrollable && <InvisibleScrollHandler />} */}
    </BackgroundStyles>
  );
}

const BackgroundStyles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
