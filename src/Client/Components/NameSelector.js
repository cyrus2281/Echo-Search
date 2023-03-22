import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import AbcIcon from "@mui/icons-material/Abc";

function NameSelector({ form }) {
  const [search, setSearch] = useState("");
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [regex, setRegex] = useState(false);

  useEffect(() => {
    form.current.query.searchQuery = search;
    form.current.query.isRegex = regex;
    form.current.query.caseInsensitive = caseInsensitive;
  }, [search, caseInsensitive, regex]);

  const searchLabel =
    (regex ? "Regular Expression" : "Search Query") +
    (caseInsensitive ? " (case insensitive)" : "");

  return (
    <Grid container spacing={2} display="flex" alignItems={"center"}>
      <Grid item xs={12} mx={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 1,
          }}
        >
          <Box sx={{ width: "93%", display: "flex", alignItems: "flex-end" }}>
            <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              id="search"
              maxRows={5}
              label={searchLabel}
              variant="standard"
              fullWidth
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          <Tooltip
            title="Full or partial file name. Do not include path. Regular expressions are not supported yet."
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
            selected={regex}
            onChange={(e) => setRegex(!regex)}
          >
            <AbcIcon sx={{ mr: 1 }} /> Use RegEx
          </ToggleButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}

export default NameSelector;
