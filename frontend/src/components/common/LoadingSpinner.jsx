import { Box, CircularProgress } from "@mui/material";

function LoadingSpinner() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
      <CircularProgress />
    </Box>
  );
}

export default LoadingSpinner;