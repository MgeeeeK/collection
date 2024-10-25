import React from "react";
import { Box, Drawer, Toolbar, Typography } from "@mui/material";

interface SideNavProps {
  children?: React.ReactNode;
}

const DRAWER_WIDTH = 240;

const SideNav: React.FC<SideNavProps> = ({ children }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: DRAWER_WIDTH,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        width: DRAWER_WIDTH,
        boxSizing: "border-box",
      },
    }}
  >
    <Toolbar />
    <Box sx={{ overflow: "auto" }}>
      <Box sx={{ padding: 2, borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="h6" component="div">
          Folders
        </Typography>
      </Box>
      {children}
    </Box>
  </Drawer>
);

export default SideNav;
