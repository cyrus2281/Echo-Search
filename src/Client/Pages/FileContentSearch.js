import React from "react";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import DirectorySelector from "../Components/DirectorySelector";
import InclusionSelector from "../Components/InclusionSelector";
import QuerySelector from "../Components/QuerySelector";
import AdvancedSettings from "../Components/AdvancedSettings";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));


function FileContentSearch({ form, biDirectionalChannel }) {

  return (
    <>
      <Grid item xs={12}>
        <Item>
          <DirectorySelector form={form} />
        </Item>
      </Grid>
      <Grid item xs={12}>
        <Item>
          <QuerySelector form={form} channel={biDirectionalChannel} />
        </Item>
      </Grid>
      <Grid item xs={12}>
        <Item>
          <InclusionSelector form={form} />
        </Item>
      </Grid>
      <Grid item xs={12}>
        <Item>
          <AdvancedSettings form={form} channel={biDirectionalChannel} />
        </Item>
      </Grid>
    </>
  );
}

export default FileContentSearch;
