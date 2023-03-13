import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { CHANNELS, SEARCH_MODES } from "../../constants.mjs";

const { ipcSend } = window.api;

function Banner({ searchMode, setSearchMode, disabled }) {
  return (
    <>
      <Toolbar
        disableGutters
        sx={{
          paddingBottom: "1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FormControl
          sx={{ m: 1, position: "absolute", left: 0, top: 0 }}
          size="small"
        >
          <InputLabel id="search-mode-label">Search Mode</InputLabel>
          <Select
            labelId="search-mode-label"
            value={searchMode}
            label="Search Mode"
            onChange={(e) => {
              setSearchMode(e.target.value);
              ipcSend(CHANNELS.INFO_MODE_SET, { searchMode: e.target.value });
            }}
            disabled={disabled}
          >
            <MenuItem value={SEARCH_MODES.FILE_CONTENT}>File Content</MenuItem>
            <MenuItem value={SEARCH_MODES.FILE_NAME}>File Name</MenuItem>
          </Select>
        </FormControl>
        <Typography
          variant="h1"
          noWrap
          sx={{
            fontFamily: "Roboto",
            fontWeight: 700,
            fontSize: "2rem",
            letterSpacing: ".125rem",
            marginLeft: "1rem",
            textTransform: "uppercase",
            color: "primary.main",
          }}
        >
          Echo Search
        </Typography>
      </Toolbar>
      <Divider />
    </>
  );
}

export default Banner;
