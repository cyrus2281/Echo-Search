import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function NameSelector({ form }) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    form.current.query.searchQuery = search;
  }, [search]);

  const searchLabel = "File name";

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
    </Grid>
  );
}

export default NameSelector;
