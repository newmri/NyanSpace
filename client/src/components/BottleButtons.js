import React from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as Cup185mlSvg } from "../assets/images/bottles/185ml.svg";
import { ReactComponent as Can355mlSvg } from "../assets/images/bottles/355ml.svg";
import { ReactComponent as Pet500mlSvg } from "../assets/images/bottles/500ml.svg";
import { ReactComponent as Pet1lSvg } from "../assets/images/bottles/1l.svg";
import "../styles/bottle.css";

function BottleButton({ SvgComponent, label, viewBox, scale = 1, ...props }) {
  return (
    <Button variant="text" className="bottle-button" {...props}>
      <SvgIcon
        component={SvgComponent}
        viewBox={viewBox}
        fontSize="inherit"
        style={{ transform: `scale(${scale})` }}
      />
      <div>{label}</div>
    </Button>
  );
}

export function ButtonCup185ml(props) {
  return (
    <BottleButton
      SvgComponent={Cup185mlSvg}
      label="185ml"
      viewBox="0 0 167.000000 311.000000"
      scale={0.6}
      {...props}
    />
  );
}

export function ButtonCan355ml(props) {
  return (
    <BottleButton
      SvgComponent={Can355mlSvg}
      label="355ml"
      viewBox="0 0 175.000000 282.000000"
      scale={0.6}
      {...props}
    />
  );
}

export function ButtonPet500ml(props) {
  return (
    <BottleButton
      SvgComponent={Pet500mlSvg}
      label="500ml"
      viewBox="0 0 133.000000 282.000000"
      scale={0.8}
      {...props}
    />
  );
}

export function ButtonPet1l(props) {
  return (
    <BottleButton
      SvgComponent={Pet1lSvg}
      label="1L"
      viewBox="0 0 171.000000 285.000000"
      {...props}
    />
  );
}

export default function BottleButtons({ onAdd }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
      <ButtonCup185ml onClick={() => onAdd(185)} />
      <ButtonCan355ml onClick={() => onAdd(355)} />
      <ButtonPet500ml onClick={() => onAdd(500)} />
      <ButtonPet1l onClick={() => onAdd(1000)} />
    </Box>
  );
}
