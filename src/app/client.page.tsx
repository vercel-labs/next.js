"use client";

import { useState } from "react";
import styled from "styled-components";

export const ClientComponent = () => {
  const [showRed, setShowRed] = useState(false);

  const toggleColor = () => {
    setShowRed(show => !show);
  }

  if (showRed) {
    return <Blue onClick={toggleColor}>Blue (click to switch)</Blue>;
  }
  return <Green onClick={toggleColor}>Green (click to switch)</Green>;
};

const Green = styled.div`
  color: green;
`;

const Blue = styled(Green)`
    color: blue;
`;
