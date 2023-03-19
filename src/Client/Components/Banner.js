import React from "react";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { CHANNELS, SEARCH_MODES } from "../../constants.mjs";
import useSearchQuery from "../store/useSearchQuery.js";

const { ipcSend } = window.api;

function Banner({ disabled }) {
  const [searchMode, setSearchMode] = useSearchQuery((state) => [
    state.searchMode,
    state.setSearchMode,
  ]);
  const resetSearchQuery = useSearchQuery((state) => state.resetSearchQuery);

  return (
    <>
      <Toolbar
        disableGutters
        sx={{
          paddingBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <FormControl sx={{ m: 1 }} size="small">
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
            textTransform: "uppercase",
            color: "primary.main",
            position: "absolute",
            textAlign: "center",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Echo Search
        </Typography>
        <Box
          sx={{
            m: 1,
          }}
        >
          <Tooltip title="Reset search query">
            <Button
              variant="outlined"
              onClick={() => resetSearchQuery(searchMode)}
            >
              RESET
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>
      <Divider />
    </>
  );
}

export default Banner;
