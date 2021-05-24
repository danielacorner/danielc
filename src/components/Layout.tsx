import React from "react";
import styled from "styled-components/macro";

const Layout = ({ children }) => {
  return <LayoutStyles>{children}</LayoutStyles>;
};

const LayoutStyles = styled.main``;

export default Layout;
