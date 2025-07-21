import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as Cup185mlSvg } from "../../assets/images/bottles/185ml.svg";
import { ReactComponent as Can355mlSvg } from "../../assets/images/bottles/355ml.svg";
import { ReactComponent as Pet500mlSvg } from "../../assets/images/bottles/500ml.svg";
import { ReactComponent as Pet1lSvg } from "../../assets/images/bottles/1l.svg";
import "../../styles/bottle.css";
import { DRINK, drinkTypes } from "../../api/DrinkApi";

// 병 버튼 컴포넌트
function BottleButton({
  SvgComponent,
  label,
  viewBox,
  scale = 1,
  onClick,
  onChangeTypeClick,
  currentType,
}) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Button variant="text" className="bottle-button" onClick={onClick}>
        <SvgIcon
          component={SvgComponent}
          viewBox={viewBox}
          fontSize="inherit"
          style={{ transform: `scale(${scale})` }}
        />
      </Button>
      <Typography variant="body2">
        {label} <br />
        {drinkTypes.find((d) => d.type === currentType)?.label || "?"}
        <Tooltip title="음료 종류 변경">
          <IconButton size="small" onClick={onChangeTypeClick}>
            <SettingsIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Typography>
    </Box>
  );
}

export default function BottleButtons({ onAdd }) {
  // 용량별 기본 음료 타입 저장
  const [defaultTypes, setDefaultTypes] = useState({
    185: DRINK.WATER.type,
    355: DRINK.WATER.type,
    500: DRINK.WATER.type,
    1000: DRINK.WATER.type,
  });

  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (amount) => {
    setSelectedAmount(amount);
    setSelectedType(defaultTypes[amount]);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedAmount && selectedType) {
      // 기본 타입 저장
      setDefaultTypes((prev) => ({
        ...prev,
        [selectedAmount]: selectedType,
      }));
      setModalOpen(false);
    }
  };

  const handleClick = (amount) => {
    const type = defaultTypes[amount];
    onAdd(type, amount);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 2,
          flexWrap: "wrap",
        }}
      >
        <BottleButton
          label="185ml"
          SvgComponent={Cup185mlSvg}
          viewBox="0 0 167.000000 311.000000"
          scale={0.6}
          onClick={() => handleClick(185)}
          onChangeTypeClick={() => openModal(185)}
          currentType={defaultTypes[185]}
        />
        <BottleButton
          label="355ml"
          SvgComponent={Can355mlSvg}
          viewBox="0 0 175.000000 282.000000"
          scale={0.6}
          onClick={() => handleClick(355)}
          onChangeTypeClick={() => openModal(355)}
          currentType={defaultTypes[355]}
        />
        <BottleButton
          label="500ml"
          SvgComponent={Pet500mlSvg}
          viewBox="0 0 133.000000 282.000000"
          scale={0.8}
          onClick={() => handleClick(500)}
          onChangeTypeClick={() => openModal(500)}
          currentType={defaultTypes[500]}
        />
        <BottleButton
          label="1L"
          SvgComponent={Pet1lSvg}
          viewBox="0 0 171.000000 285.000000"
          onClick={() => handleClick(1000)}
          onChangeTypeClick={() => openModal(1000)}
          currentType={defaultTypes[1000]}
        />
      </Box>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>음료 종류 선택</DialogTitle>
        <DialogContent>
          <Stack spacing={1} mt={1}>
            {drinkTypes.map((drink) => (
              <Button
                key={drink.type}
                variant={selectedType === drink.type ? "contained" : "outlined"}
                onClick={() => setSelectedType(drink.type)}
              >
                {drink.label}
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>취소</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!selectedType}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
