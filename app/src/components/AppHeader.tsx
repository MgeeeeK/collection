import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

interface AppHeaderProps {
  children?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ children }) => (
  <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <IconButton
        color="inherit"
        edge="start"
        sx={{ mr: 2, display: { sm: "none" } }}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap component="div">
        I&F
      </Typography>
      {children}
    </Toolbar>
  </AppBar>
);

export default AppHeader;
