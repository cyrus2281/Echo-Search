import React, { useEffect, useState } from "react";

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

import RegexFlags, { defaultRegexFlagsValues } from "./RegexFlags";

function AdvancedSettings({ form, channel}) {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    setOpen(!open);
  };
  
  const clearCustomization = () => {
    if (
      !open &&
      (form.current.query.regexFlags?.length)
    ) {
      channel.current.caseInsensitivity.setFlag = null;
      const info = "Cleared advanced settings.";
      enqueueSnackbar(info, { variant: "info", autoHideDuration: 3000 });
      form.current.query.regexFlags = [...defaultRegexFlagsValues];
      if (channel.current.isCaseInsensitive) {
        form.current.query.regexFlags.push("i");
      }
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
                <RegexFlags form={form} channel={channel}/>
              </Box>
            </Box>
          </ListItem>
        </List>
      </Collapse>
    </Box>
  );
}

export default AdvancedSettings;
