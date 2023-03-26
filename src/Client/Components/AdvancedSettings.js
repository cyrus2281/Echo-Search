import React, { useState } from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import { useSnackbar } from "notistack";

import MultiThreading from "./MultiThreading";
import RegexFlags from "./RegexFlags";

import useSearchQuery from "../store/useSearchQuery";

function AdvancedSettings() {
  const { enqueueSnackbar } = useSnackbar();
  const isAdvancedSettingsDirty = useSearchQuery(
    (state) => state.isAdvancedSettingsDirty
  );
  const resetAdvancedSettings = useSearchQuery(
    (state) => state.resetAdvancedSettings
  );
  const [open, setOpen] = useSearchQuery(
    (state) => [state.openAdvancedSettings, state.setOpenAdvancedSettings],
  );

  const handleClick = () => {
    setOpen(!open);
  };

  const clearCustomization = () => {
    if (!open && isAdvancedSettingsDirty()) {
      resetAdvancedSettings();
      const info = "Cleared advanced settings.";
      enqueueSnackbar(info, { variant: "info", autoHideDuration: 3000 });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary="Advanced Settings" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        onExited={clearCustomization}
      >
        <List component="div" disablePadding>
          <ListItem>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <MultiThreading />
              </Box>
              <Box sx={{ width: "100%" }}>
                <Divider />
              </Box>
              <Box sx={{ width: "100%" }}>
                <RegexFlags />
              </Box>
            </Box>
          </ListItem>
        </List>
      </Collapse>
    </Box>
  );
}

export default AdvancedSettings;
