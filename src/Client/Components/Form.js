import React, { useEffect, useRef } from "react";

import { useSnackbar } from "notistack";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import Banner from "./Banner";
import DirectorySelector from "./DirectorySelector";
import InclusionSelector from "./InclusionSelector";
import Output from "./Output";
import QuerySelector from "./QuerySelector";
import AdvancedSettings from "./AdvancedSettings";
import { defaultRegexFlagsValues } from "./RegexFlags";
import Footer from "./Footer";
import { CHANNELS } from "../../constants.mjs";

const { ipcSend, ipcListen } = window.api;

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
  const formData = useRef({
    query: { regexFlags: [...defaultRegexFlagsValues] },
  });
  const biDirectionalChannel = useRef({ caseInsensitivity: {} });
  const { enqueueSnackbar } = useSnackbar();
  const [processID, setProcessID] = React.useState("");
  const [isRunning, setIsRunning] = React.useState(false);
  const [disableBtn, setDisableBtn] = React.useState(false);
  const [showOutput, setShowOutput] = React.useState(false);

  const onButtonClick = (e) => {
    if (disableBtn) return;
    if (isRunning && processID) {
      setDisableBtn(true);
      ipcSend(CHANNELS.SEARCH_CANCEL, { processID });
    } else {
      const hasError = validateForm(formData);
      console.log(formData.current, hasError);
      if (hasError.length) {
        hasError.forEach((error) =>
          enqueueSnackbar(error, { variant: "error", autoHideDuration: 3000 })
        );
        return;
      }
      showOutput && setShowOutput(false);
      setDisableBtn(true);
      setIsRunning(true);
      ipcSend(CHANNELS.SEARCH_START, formData.current);
    }
  };

  useEffect(() => {
    if (isRunning) {
      setShowOutput(true);
    }
  }, [isRunning]);

  useEffect(() => {
    const showError = (error) => {
      enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 3000,
      });
      console.error(error.error);
      setDisableBtn(false);
      setIsRunning(false);
      setProcessID("");
    };
    return ipcListen(CHANNELS.SEARCH_FAIL, showError);
  }, [enqueueSnackbar]);

  useEffect(() => {
    const onComplete = (event) => {
      enqueueSnackbar(event.message, {
        variant: "success",
        autoHideDuration: 2000,
      });
      setDisableBtn(false);
      setIsRunning(false);
      setProcessID("");
    };
    return ipcListen(CHANNELS.SEARCH_COMPLETE, onComplete);
  }, [enqueueSnackbar]);

  useEffect(() => {
    const onReceiveID = (event) => {
      setProcessID(event.processID);
      setDisableBtn(false);
    };
    return ipcListen(CHANNELS.SEARCH_PROCESS_ID, onReceiveID);
  }, []);

  const buttonProps =
    isRunning && processID
      ? { variant: "outlined", color: "error" }
      : { variant: "contained" };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        margin: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          height: "100%",
          width: "100%",
          maxWidth: "1000px",
          padding: "1rem",
          margin: "0 auto",
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
              <QuerySelector form={formData} channel={biDirectionalChannel} />
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <InclusionSelector form={formData} />
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <AdvancedSettings
                form={formData}
                channel={biDirectionalChannel}
              />
            </Item>
          </Grid>
          <Grid item xs={8} margin="auto">
            <Button
              {...buttonProps}
              fullWidth
              disabled={disableBtn}
              onClick={onButtonClick}
            >
              {isRunning && processID
                ? disableBtn
                  ? "Canceling"
                  : "Cancel"
                : "Run"}
            </Button>
          </Grid>
          <Grid item xs={12}>
            {showOutput && (
              <Item>
                <Output isRunning={isRunning} />
              </Item>
            )}
          </Grid>
        </Grid>
      </Paper>
      <Footer />
    </Box>
  );
}

export default Form;
