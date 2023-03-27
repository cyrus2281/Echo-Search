import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CancelIcon from "@mui/icons-material/CancelPresentation";
import DownArrowIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import ClearIcon from "@mui/icons-material/Clear";

import Console from "./Console";
import {
  CHANNELS,
  MESSAGE_MODES,
  MESSAGE_MODES_STYLES,
  SEARCH_MODES,
} from "../../constants.mjs";
import { getMessage, getProgressBarColor, getProgressBarMode } from "../Utils";

const { ipcListen } = window.api;

const FAILED_SEARCH_HEADING = "Search exited with error!";

function ConsoleSearch({ onSearchRef }) {
  const searchBounceRef = useRef();
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <TextField
        label="Search"
        size="small"
        value={searchText}
        sx={{
          "@media (max-width: 820px)": {
            width: "150px",
          },
        }}
        onChange={(e) => {
          clearTimeout(searchBounceRef.current);
          setSearchText(e.target.value);
          searchBounceRef.current = setTimeout(() => {
            if (e.target.value.trim())
              onSearchRef.current.search(e.target.value);
          }, 500);
        }}
      />
      {searchText && (
        <IconButton
          size="small"
          onClick={() => {
            setSearchText("");
            onSearchRef.current.search("");
          }}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      )}
    </>
  );
}

function Output({ isRunning, searchMode }) {
  // due to async nature of useState, we might miss some messages, using ref
  const allMessages = useRef([]);
  const listControlRef = useRef({});
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [heading, setHeading] = useState("Searching for files...");

  useEffect(() => {
    const showProgress = (update) => {
      if (update.message) {
        const message = getMessage(update);
        allMessages.current.push(message);
      }
      if (update.mode === MESSAGE_MODES.ERROR && update.error) {
        console.error(update.error);
      }
      if (searchMode === SEARCH_MODES.FILE_CONTENT && update.progress) {
        const roundedProgress = Math.round(+update.progress * 10) / 10;
        const heading = `Updating files. ${roundedProgress.toFixed(
          1
        )}% completed.`;
        setHeading(heading);
        setProgress(roundedProgress);
      }
    };
    return ipcListen(CHANNELS.SEARCH_PROGRESS, showProgress);
  }, []);

  useEffect(() => {
    const onComplete = (event) => {
      const message = {
        message: event.message,
        mode: MESSAGE_MODES_STYLES.SUCCESS,
      };
      allMessages.current.push(message);
      setHeading("All Done!");
      setProgress(100);
    };
    return ipcListen(CHANNELS.SEARCH_COMPLETE, onComplete);
  }, []);

  useEffect(() => {
    const showError = (error) => {
      const message = {
        message: error.message,
        mode: MESSAGE_MODES_STYLES.ERROR,
      };
      allMessages.current.push(message);
      setProgress(100);
      setHasError(true);
    };
    return ipcListen(CHANNELS.SEARCH_FAIL, showError);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
        color={getProgressBarColor(hasError, progress)}
        variant={getProgressBarMode(isRunning, searchMode, progress)}
        value={isRunning ? progress : 100}
      />
      <Typography variant="h6" sx={{ pt: 2, pb: 1, position: "relative" }}>
        {hasError ? FAILED_SEARCH_HEADING : heading}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 10,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <ConsoleSearch onSearchRef={listControlRef} />
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            display: "flex",
            gap: 1,
          }}
        >
          <Tooltip title="Scroll to bottom">
            <IconButton
              size="small"
              onClick={() => {
                listControlRef.current.scrollToEnd();
              }}
            >
              <DownArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear output">
            <IconButton size="small" onClick={() => (allMessages.current = [])}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Console messagesRef={allMessages} listControlRef={listControlRef} />
      </Box>
    </Box>
  );
}

export default Output;
