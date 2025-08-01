import { TextField, Button, Box } from "@mui/material";

export default function DiaryInput({ value, onChange, onSave }) {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "stretch", sm: "center" }}
      gap={1}
      mb={2}
      width="100%"
    >
      <TextField
        label="오늘의 감정을 기록해보세요"
        variant="outlined"
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          sx: {
            height: {
              xs: 52,
              sm: 60,
              md: 70,
              lg: 90,
              xl: 110,
            },
            fontSize: {
              xs: 16,
              sm: 18,
              md: 20,
              lg: 22,
              xl: 24,
            },
            paddingX: 1.5,
          },
        }}
        InputLabelProps={{
          sx: {
            fontSize: {
              xs: 14,
              sm: 16,
              md: 18,
              lg: 20,
              xl: 22,
            },
          },
        }}
      />

      <Button
        variant="contained"
        onClick={onSave}
        sx={{
          width: { xs: "auto" },
          height: {
            xs: 52,
            sm: 60,
            md: 70,
            lg: 90,
            xl: 110,
          },
          fontSize: {
            xs: 16,
            sm: 18,
            md: 20,
            lg: 22,
            xl: 24,
          },
          whiteSpace: "nowrap",
        }}
      >
        기록하기
      </Button>
    </Box>
  );
}
