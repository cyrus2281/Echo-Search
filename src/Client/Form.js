import React, { useEffect, useState } from "react";

import { useSnackbar } from "notistack";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import Banner from "./Components/Banner/Banner";
import Output from "./Components/Output";
import Footer from "./Components/Footer";
import DialogAlert from "./Components/DialogAlert";

import FileContentSearch from "./Pages/FileContentSearch";
import FileNameSearch from "./Pages/FileNameSearch";

import { shallow } from "zustand/shallow";
import { validateForm } from "./Utils";
import { CHANNELS, DIALOG_ACTIONS_TYPES, EMPTY_REPLACE_ERROR, SEARCH_MODES } from "../constants.mjs";
import useSearchQuery from "./store/useSearchQuery";
import CodeEditorDialog from "./Components/Editor/CodeEditorDialog";
import useDialog from "./store/useDialog";

const { ipcSend, ipcListen } = window.api;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Form() {
  const [
    searchMode,
    setSearchMode,
    getSearchQuery,
    resetSearchQuery,
    addToHistory,
  ] = useSearchQuery(
    (state) => [
      state.searchMode,
      state.setSearchMode,
      state.getSearchQuery,
      state.resetSearchQuery,
      state.addToHistory,
    ],
    shallow
  );
  const addToDialogQueue = useDialog((state) => state.addToDialogQueue);

  const { enqueueSnackbar } = useSnackbar();
  const [processID, setProcessID] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const onButtonClick = () => {
    if (disableBtn) return;
    if (isRunning && processID) {
      setDisableBtn(true);
      ipcSend(CHANNELS.SEARCH_CANCEL, { processID });
    } else {
      const performSearch = () => {
        addToHistory();
        showOutput && setShowOutput(false);
        setDisableBtn(true);
        setIsRunning(true);
        ipcSend(CHANNELS.SEARCH_START, searchQuery);
      };
      const searchQuery = getSearchQuery();
      const hasError = validateForm(searchQuery, searchMode);
      console.log(searchQuery, hasError);
      if (hasError.length) {
        hasError.forEach((error) =>
          enqueueSnackbar(error, { variant: "error", autoHideDuration: 3000 })
        );
        return;
      }
      if (hasError === EMPTY_REPLACE_ERROR) {
        const dialogProp = {
          title: "Are You Sure!?",
          message: [
            "You are about to replace all the matches with an empty space.",
          ],
          buttons: [
            {
              label: "Cancel",
              type: DIALOG_ACTIONS_TYPES.DISMISS,
            },
            {
              label: "Search & Delete",
              action: performSearch,
            },
          ],
        };
        addToDialogQueue(dialogProp);
        return;
      }
      performSearch();
    }
  };

  useEffect(() => {
    if (isRunning) {
      setShowOutput(true);
    }
  }, [isRunning]);

  // on error listener
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

  // on complete listener
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

  // on process id listener
  useEffect(() => {
    const onReceiveID = (event) => {
      setProcessID(event.processID);
      setDisableBtn(false);
    };
    return ipcListen(CHANNELS.SEARCH_PROCESS_ID, onReceiveID);
  }, []);

  // on mount search mode listener
  useEffect(() => {
    ipcSend(CHANNELS.INFO_MODE_REQUEST);
    const onMountMode = ({ searchMode }) => {
      setSearchMode(searchMode);
    };
    return ipcListen(CHANNELS.INFO_MODE_RESPONSE, onMountMode);
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
        maxWidth: "1100px",
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
            <Banner disabled={isRunning} />
          </Grid>
          {searchMode === SEARCH_MODES.FILE_CONTENT ? (
            <FileContentSearch />
          ) : (
            <FileNameSearch />
          )}
          <Grid
            item
            xs={12}
            margin="auto"
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: "24px",
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
            <Button
              {...buttonProps}
              fullWidth
              sx={{ maxWidth: "60%", margin: "0 auto" }}
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
      <CodeEditorDialog />
    </Box>
  );
}

export default Form;
