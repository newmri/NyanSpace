import React, { useState } from "react";
import {
  Typography,
  TextField,
  Box,
  Button,
  MenuItem,
  Paper,
  Grid,
} from "@mui/material";
import { toNumber, displayValue, formatNumber } from "../utils/calculate";

export default function PercentageCalculatorPage() {
  const [wholeForRate, setWholeForRate] = useState("");
  const [percentForWhole, setPercentForWhole] = useState("");

  const [partOfWhole, setPartOfWhole] = useState("");
  const [wholeForPart, setWholeForPart] = useState("");

  const [originalValue, setOriginalValue] = useState("");
  const [newValue, setNewValue] = useState("");

  const [baseForChange, setBaseForChange] = useState("");
  const [rateOfChange, setRateOfChange] = useState("");
  const [changeMode, setChangeMode] = useState("증가");

  const handleReset = () => {
    setWholeForRate("");
    setPercentForWhole("");
    setPartOfWhole("");
    setWholeForPart("");
    setOriginalValue("");
    setNewValue("");
    setBaseForChange("");
    setRateOfChange("");
    setChangeMode("증가");
  };

  const sectionStyle = {
    p: 3,
    mb: 4,
    borderRadius: 3,
    boxShadow: 3,
  };

  const inputProps = {
    type: "number",
    inputProps: { step: "any" },
    size: "small",
    fullWidth: true,
  };

  return (
    <>
      <Typography variant="h4" gutterBottom textAlign="center">
        퍼센트 계산기
      </Typography>

      {/* 섹션 1 */}
      <Paper sx={sectionStyle}>
        <Typography variant="subtitle1" gutterBottom>
          전체값에서 일정 비율에 해당하는 값을 계산합니다.
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <TextField
              label="전체값"
              value={wholeForRate}
              onChange={(e) => setWholeForRate(e.target.value)}
              {...inputProps}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography>의</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="비율값 (%)"
              value={percentForWhole}
              onChange={(e) => setPercentForWhole(e.target.value)}
              {...inputProps}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography>는</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="일부값"
              value={
                "" === wholeForRate || "" === percentForWhole
                  ? ""
                  : formatNumber(
                      displayValue(
                        (toNumber(wholeForRate) * toNumber(percentForWhole)) /
                          100
                      )
                    )
              }
              disabled
              {...inputProps}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 섹션 2 */}
      <Paper sx={sectionStyle}>
        <Typography variant="subtitle1" gutterBottom>
          전체값의 일정 값에 해당하는 비율을 계산합니다.
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <TextField
              label="전체값"
              value={wholeForPart}
              onChange={(e) => setWholeForPart(e.target.value)}
              {...inputProps}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography>에서</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="일부값"
              value={partOfWhole}
              onChange={(e) => setPartOfWhole(e.target.value)}
              {...inputProps}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography>은(는)</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="비율값 (%)"
              value={
                "" === wholeForPart ||
                "" === partOfWhole ||
                0 === toNumber(wholeForPart)
                  ? ""
                  : formatNumber(
                      displayValue(
                        (toNumber(partOfWhole) / toNumber(wholeForPart)) * 100
                      )
                    )
              }
              disabled
              {...inputProps}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 섹션 3 */}
      <Paper sx={sectionStyle}>
        <Typography variant="subtitle1" gutterBottom>
          기준값이 변경값으로 변화시 얼만큼 증가/감소했는지 계산합니다.
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <TextField
              label="기준값"
              value={originalValue}
              onChange={(e) => setOriginalValue(e.target.value)}
              {...inputProps}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography>이(가)</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="변경값"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              {...inputProps}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography>로 바뀌면</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="변화율 (%)"
              value={
                "" === originalValue ||
                "" === newValue ||
                0 === toNumber(originalValue)
                  ? ""
                  : formatNumber(
                      displayValue(
                        ((toNumber(newValue) - toNumber(originalValue)) /
                          toNumber(originalValue)) *
                          100
                      )
                    )
              }
              disabled
              {...inputProps}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 섹션 4 */}
      <Paper sx={sectionStyle}>
        <Typography variant="subtitle1" gutterBottom>
          기준값에서 일정 비율로 증가/감소한 결과를 계산합니다.
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <TextField
              label="기준값"
              value={baseForChange}
              onChange={(e) => setBaseForChange(e.target.value)}
              {...inputProps}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography>이(가)</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="비율값 (%)"
              value={rateOfChange}
              onChange={(e) => setRateOfChange(e.target.value)}
              {...inputProps}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              select
              value={changeMode}
              onChange={(e) => setChangeMode(e.target.value)}
              {...inputProps}
            >
              <MenuItem value="증가">증가</MenuItem>
              <MenuItem value="감소">감소</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="결과값"
              value={
                "" === baseForChange ||
                "" === rateOfChange ||
                0 === toNumber(baseForChange)
                  ? ""
                  : "증가" === changeMode
                  ? formatNumber(
                      displayValue(
                        toNumber(baseForChange) +
                          (toNumber(baseForChange) * toNumber(rateOfChange)) /
                            100
                      )
                    )
                  : formatNumber(
                      displayValue(
                        toNumber(baseForChange) -
                          (toNumber(baseForChange) * toNumber(rateOfChange)) /
                            100
                      )
                    )
              }
              disabled
              {...inputProps}
            />
          </Grid>
        </Grid>
      </Paper>

      <Box textAlign="center">
        <Button variant="outlined" color="primary" onClick={handleReset}>
          초기화
        </Button>
      </Box>
    </>
  );
}
