import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AbcIcon from "@mui/icons-material/Abc";
import SpaceBarIcon from "@mui/icons-material/SpaceBar";

function QuerySelector({ form, channel }) {
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [regex, setRegex] = useState(false);
  const [matchWhole, setMatchWhole] = useState(false);

  const updateCaseInsensitivity = (checked) => {
    setCaseInsensitive(checked);
    channel.current.isCaseInsensitive = checked;
    if (channel.current.caseInsensitivity?.setFlag) {
      channel.current.caseInsensitivity.setFlag(checked);
    } else {
      if (checked) {
        if (!form.current.query.regexFlags.includes("i")) {
          form.current.query.regexFlags.push("i");
        }
      } else {
        form.current.query.regexFlags = form.current.query.regexFlags.filter(
          (flag) => flag !== "i"
        );
      }
    }
  };

  channel.current.caseInsensitivity.setToggle = (checked) =>
    setCaseInsensitive(checked);

  useEffect(() => {
    form.current.query.searchQuery = search;
    form.current.query.replaceQuery = replace;
    form.current.query.isRegex = regex;
    form.current.query.matchWhole = matchWhole;
  }, [search, replace, regex, matchWhole]);

  const searchLabel = regex ? "Regular Expression" : "Search Query";
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
              label={searchLabel + searchLabelOptions}
              variant="standard"
              multiline
              fullWidth
              onChange={(e) => setSearch(e.target.value)}
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
      <Grid item xs={12} mx={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Box sx={{ width: "93%", display: "flex", alignItems: "flex-end" }}>
            <FindReplaceIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              id="replace"
              label="Replace Value"
              variant="standard"
              multiline
              fullWidth
              onChange={(e) => setReplace(e.target.value)}
            />
          </Box>
          <Tooltip
            title="Replace value should be a normal text."
            sx={{ pr: 1 }}
          >
            <IconButton>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
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
        <Tooltip title="Ignore matching case">
          <ToggleButton
            value="caseInsensitive"
            selected={caseInsensitive}
            onChange={(e) => updateCaseInsensitivity(!caseInsensitive)}
          >
            <FontDownloadIcon sx={{ mr: 1 }} /> Case Insensitive
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Use regular expression instead of simple text query">
          <ToggleButton
            value="regex"
            selected={regex}
            onChange={(e) => {
              if (!regex) {
                setMatchWhole(false);
              }
              setRegex(!regex);
            }}
          >
            <AbcIcon sx={{ mr: 1 }} /> Use RegEx
          </ToggleButton>
        </Tooltip>
        {!regex && (
          <Tooltip title="Should completely match (no partial match)">
            <ToggleButton
              value="matchWhole"
              selected={matchWhole}
              onChange={(e) => setMatchWhole(!matchWhole)}
            >
              <SpaceBarIcon sx={{ mr: 1 }} /> Match Whole Word
            </ToggleButton>
          </Tooltip>
        )}
      </Grid>
    </Grid>
  );
}

export default QuerySelector;
