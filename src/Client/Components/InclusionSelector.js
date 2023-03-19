import React, { useState } from "react";

import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useSnackbar } from "notistack";

import FileTypeSelector from "./FileTypeSelector";
import ExcludeSelector from "./ExcludeSelector";

import { shallow } from "zustand/shallow";
import useSearchQuery from "../store/useSearchQuery";

function InclusionSelector({
  excludeSelectorProps = {},
  fileTypeSelectorProps = {},
}) {
  const isCustomInclusionDirty = useSearchQuery(
    (state) => state.isCustomInclusionDirty
  );
  const resetCustomInclusion = useSearchQuery(
    (state) => state.resetCustomInclusion
  );
  const [open, setOpen] = useSearchQuery((state) => [
    state.openCustomInclusion,
    state.setOpenCustomInclusion,
  ]);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    setOpen(!open);
  };

  const clearCustomization = () => {
    if (!open && isCustomInclusionDirty()) {
      const info = "Cleared custom file inclusion.";
      enqueueSnackbar(info, { variant: "info", autoHideDuration: 3000 });
      resetCustomInclusion();
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary="Customize File Inclusion" />
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
                <FileTypeSelector {...fileTypeSelectorProps} />
              </Box>
              <Box sx={{ width: "100%" }}>
                <Divider />
              </Box>
              <Box sx={{ width: "100%" }}>
                <ExcludeSelector {...excludeSelectorProps} />
              </Box>
            </Box>
          </ListItem>
        </List>
      </Collapse>
    </Box>
  );
}

export default InclusionSelector;
