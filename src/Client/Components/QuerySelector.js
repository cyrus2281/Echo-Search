import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import SearchIcon from "@mui/icons-material/Search";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AbcIcon from "@mui/icons-material/Abc";
import SpaceBarIcon from "@mui/icons-material/SpaceBar";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import SwapVertIcon from "@mui/icons-material/SwapVert";

import { shallow } from "zustand/shallow";
import useSearchQuery from "../store/useSearchQuery";

function QuerySelector() {
  const [searchQuery, setSearchQuery] = useSearchQuery(
    (state) => [state.searchQuery, state.setSearchQuery],
    shallow
  );
  const [replaceQuery, setReplaceQuery] = useSearchQuery(
    (state) => [state.replaceQuery, state.setReplaceQuery],
    shallow
  );
  const [caseInsensitive, setCaseInsensitive] = useSearchQuery(
    (state) => [state.caseInsensitive, state.setCaseInsensitive],
    shallow
  );
  const [matchWhole, setMatchWhole] = useSearchQuery(
    (state) => [state.matchWhole, state.setMatchWhole],
    shallow
  );
  const [isRegex, setIsRegex] = useSearchQuery(
    (state) => [state.isRegex, state.setIsRegex],
    shallow
  );
  const [isSearchOnly, setIsSearchOnly] = useSearchQuery(
    (state) => [state.isSearchOnly, state.setIsSearchOnly],
    shallow
  );

  const searchLabel = isRegex ? "Regular Expression" : "Search Query";
  const searchLabelOptions =
    caseInsensitive || matchWhole
      ? " (" +
        (matchWhole
          ? caseInsensitive
            ? "Case Insensitive, Match Whole"
            : "Match Whole"
          : "Case Insensitive") +
        ")"
      : "";

  return (
    <Grid container spacing={2} display="flex" alignItems={"center"}>
      <Grid item xs={12} mx={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Box sx={{ width: "93%", display: "flex", alignItems: "flex-end" }}>
            <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              id="search"
              maxRows={5}
              label={searchLabel + searchLabelOptions}
              variant="standard"
              multiline
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>
          <Tooltip
            title="Search query can either be a text or a regular expression. For RegEx do NOT enclose with slash."
            sx={{ pr: 1 }}
          >
            <IconButton>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>
      <Grid item xs={12} mx={2}  position="relative">
        <Collapse in={!isSearchOnly} timeout="auto">
          <Tooltip title="Swap search and replace query.">
            <IconButton sx={{position: "absolute", top: "-2px", left:"-4px", fontSize: "80px"}} size="small" onClick={() => {
              setSearchQuery(replaceQuery);
              setReplaceQuery(searchQuery);
            }}>
              <SwapVertIcon sx={{width: '20px', height: '20px'}} />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Box sx={{ width: "93%", display: "flex", alignItems: "flex-end" }}>
              <FindReplaceIcon
                sx={{ color: "action.active", mr: 1, my: 0.5 }}
              />
              <TextField
                id="replace"
                label="Replace Value"
                variant="standard"
                maxRows={5}
                multiline
                fullWidth
                value={replaceQuery || ""}
                onChange={(e) => setReplaceQuery(e.target.value)}
              />
            </Box>
            <Tooltip
              title="Replace value should be a normal text. Can be turned off by activating 'search only'."
              sx={{ pr: 1 }}
            >
              <IconButton>
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Collapse>
      </Grid>
      <Grid
        item
        xs={12}
        mx={2}
        mb={1}
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        gap={2}
      >
        <Typography variant="body2">Options: </Typography>
        <Tooltip title="Perform a search only operation. (No replace query)">
          <ToggleButton
            value="searchOnly"
            size="small"
            selected={isSearchOnly}
            onChange={(e) => setIsSearchOnly(!isSearchOnly)}
          >
            <SearchOffIcon sx={{ mr: 1 }} /> Search Only
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Ignore matching case">
          <ToggleButton
            value="caseInsensitive"
            size="small"
            selected={caseInsensitive}
            onChange={(e) => setCaseInsensitive(!caseInsensitive)}
          >
            <FontDownloadIcon sx={{ mr: 1 }} /> Case Insensitive
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Use regular expression instead of simple text query">
          <ToggleButton
            value="regex"
            size="small"
            selected={isRegex}
            onChange={(e) => {
              if (!isRegex) {
                setMatchWhole(false);
              }
              setIsRegex(!isRegex);
            }}
          >
            <AbcIcon sx={{ mr: 1 }} /> Use RegEx
          </ToggleButton>
        </Tooltip>
        {!isRegex && (
          <Tooltip title="Should completely match the whole word (no partial match)">
            <ToggleButton
              value="matchWhole"
              size="small"
              selected={matchWhole}
              onChange={(e) => setMatchWhole(!matchWhole)}
            >
              <SpaceBarIcon sx={{ mr: 1 }} /> Match Whole
            </ToggleButton>
          </Tooltip>
        )}
      </Grid>
    </Grid>
  );
}

export default QuerySelector;
