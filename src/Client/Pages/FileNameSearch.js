import React from "react";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import DirectorySelector from "../Components/DirectorySelector";
import InclusionSelector from "../Components/InclusionSelector";
import NameSelector from "../Components/NameSelector";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function FileNameSearch() {
  return (
    <>
      <Grid item xs={12}>
        <Item>
          <DirectorySelector />
        </Item>
      </Grid>
      <Grid item xs={12}>
        <Item>
          <NameSelector />
        </Item>
      </Grid>
      <Grid item xs={12}>
        <Item>
          <InclusionSelector
            excludeSelectorProps={{ showExcludeHiddenFiles: false }}
          />
        </Item>
      </Grid>
    </>
  );
}

export default FileNameSearch;
