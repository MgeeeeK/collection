import React from "react";
import { Box, Toolbar } from "@mui/material";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => (
  <Box
    component="main"
    sx={{
      flexGrow: 1,
      bgcolor: "background.default",
      p: 3,
    }}
  >
    <Toolbar />
    {children}
  </Box>
);

export default MainContent;
