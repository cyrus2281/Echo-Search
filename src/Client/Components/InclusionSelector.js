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

function InclusionSelector({ form }) {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    setOpen(!open);
  };

  const clearCustomization = () => {
    if (
      !open &&
      (form.current.fileTypes?.length || 
        form.current.excludes?.length || 
        form.current.excludeOptions
        )
    ) {
      const info = "Cleared custom file inclusion.";
      enqueueSnackbar(info, { variant: "info", autoHideDuration: 3000 });
      form.current.fileTypes = [];
      form.current.excludes = [];
      delete form.current.excludeOptions;
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
                <FileTypeSelector form={form} />
              </Box>
              <Box sx={{ width: "100%" }}>
                <Divider />
              </Box>
              <Box sx={{ width: "100%" }}>
                <ExcludeSelector form={form} />
              </Box>
            </Box>
          </ListItem>
        </List>
      </Collapse>
    </Box>
  );
}

export default InclusionSelector;
