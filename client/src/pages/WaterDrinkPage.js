import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function WaterDrinkPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">💧 물 마시기</Typography>
      <Typography sx={{ mt: 2 }}>물을 충분히 마셔 건강을 지켜요!</Typography>
    </Box>
  );
}

export default WaterDrinkPage;
