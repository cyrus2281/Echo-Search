import React, { useEffect, useRef, useState } from "react";

import { useSnackbar } from "notistack";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import Banner from "./Components/Banner";
import Output from "./Components/Output";
import Footer from "./Components/Footer";
import { CHANNELS, SEARCH_MODES } from "../constants.mjs";
import DialogAlert from "./Components/DialogAlert";
import FileContentSearch from "./Pages/FileContentSearch";
import { getFormDefaults, validateForm } from "./Utils";
import FileNameSearch from "./Pages/FileNameSearch";

const { ipcSend, ipcListen } = window.api;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Form() {
  const [searchMode, setSearchMode] = useState(SEARCH_MODES.FILE_CONTENT);
  const formData = useRef(getFormDefaults(searchMode));
  const biDirectionalChannel = useRef({ caseInsensitivity: {} });
  const { enqueueSnackbar } = useSnackbar();
  const [processID, setProcessID] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const updateSearchMode = (mode) => {
    if (mode === searchMode) return;
    formData.current = getFormDefaults(mode);
    setSearchMode(mode);
  };

  const onButtonClick = () => {
    if (disableBtn) return;
    if (isRunning && processID) {
      setDisableBtn(true);
      ipcSend(CHANNELS.SEARCH_CANCEL, { processID });
    } else {
      const hasError = validateForm(formData, searchMode);
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
        maxWidth: "1000px",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          height: "100%",
          width: "100%",
          padding: "1rem",
          margin: "0 auto",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Banner
              searchMode={searchMode}
              setSearchMode={updateSearchMode}
              disabled={isRunning}
            />
          </Grid>
          {searchMode === SEARCH_MODES.FILE_CONTENT ? (
            <FileContentSearch
              form={formData}
              biDirectionalChannel={biDirectionalChannel}
            />
          ) : (
            <FileNameSearch
              form={formData}
              biDirectionalChannel={biDirectionalChannel}
            />
          )}
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
                <Output isRunning={isRunning} searchMode={searchMode} />
              </Item>
            )}
          </Grid>
        </Grid>
      </Paper>
      <Footer />
      <DialogAlert />
    </Box>
  );
}

export default Form;
