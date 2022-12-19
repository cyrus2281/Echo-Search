import React, { useRef } from "react";

import { SnackbarProvider, useSnackbar } from "notistack";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

import Banner from "./Banner";
import DirectorySelector from "./DirectorySelector";
import InclusionSelector from "./InclusionSelector";
import Output from "./Output";
import QuerySelector from "./QuerySelector";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const validateForm = (form) => {
  const errors = [];
  if (!form.current.directories?.length) {
    errors.push("You at least need a directory to search in.");
  }
  if (!form.current.query?.searchQuery?.trim()) {
    errors.push("You need a search query.");
  }
  if (!form.current.query?.replaceQuery?.trim()) {
    errors.push("You need a replace query.");
  }
  return errors;
};

function Form() {
  const formData = useRef({});
  const { enqueueSnackbar } = useSnackbar();
  const [isRunning, setIsRunning] = React.useState(false);

  const onSubmit = (e) => {
    const hasError = validateForm(formData);
    console.log(formData.current, hasError);
    if (hasError.length) {
      hasError.forEach((error) =>
        enqueueSnackbar(error, { variant: "error", autoHideDuration: 3000 })
      );
      return;
    }
    setIsRunning(true);
  };

  return (
    <Paper
      elevation={5}
      sx={{
        height: "100%",
        width: "100%",
        maxWidth: "1000px",
        padding: "1rem",
        margin: "1rem",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Banner />
        </Grid>
        <Grid item xs={12}>
          <Item>
            <DirectorySelector form={formData} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <QuerySelector form={formData} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <InclusionSelector form={formData} />
          </Item>
        </Grid>
        <Grid item xs={8} margin="auto">
          <Button
            disabled={isRunning}
            variant="contained"
            fullWidth
            onClick={onSubmit}
          >
            Run
          </Button>
        </Grid>
        <Grid item xs={12}>
          {isRunning && (
            <Item>
              <Output isRunning={isRunning} />
            </Item>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Form;
