import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ClearIcon from "@mui/icons-material/CancelPresentation";

import Console from "./Console";
import { CHANNELS, MESSAGE_MODES } from "../../constants.mjs";

const { ipcListen } = window.api;

const FAILED_SEARCH_HEADING = "Operation was not completely successful.";
const MESSAGE_MODES_STYLES = {
  success: "success.main",
  error: "error.main",
  info: "text.primary",
};

const getMessage = (msg) => {
  let message = msg.message;
  let mode, isFile;
  switch (msg.mode) {
    case MESSAGE_MODES.SUCCESS:
      mode = MESSAGE_MODES_STYLES.success;
      break;
    case MESSAGE_MODES.ERROR:
      mode = MESSAGE_MODES_STYLES.error;
      break;
    case MESSAGE_MODES.UPDATE:
      mode = MESSAGE_MODES_STYLES.info;
      isFile = true;
      break;
    default:
      mode = MESSAGE_MODES_STYLES.info;
  }
  return {
    message,
    mode,
    isFile,
  };
};

function Output({ isRunning }) {
  // due to async nature of useState, we might miss some messages, using ref
  const allMessages = useRef([]);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [heading, setHeading] = useState("Searching for files...");

  useEffect(() => {
    const showProgress = (update) => {
      const progress = update.progress;
      if (update.message) {
        const message = getMessage(update);
        allMessages.current.push(message);
      }
      if (update.mode === MESSAGE_MODES.ERROR && update.error) {
        console.error(update.error);
      }
      if (progress) {
        const roundedProgress = Math.round(progress * 10) / 10;
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
      const message = { message: event.message, mode: MESSAGE_MODES_STYLES.success };
      allMessages.current.push(message);
      setHeading("All Done!");
      setProgress(100);
    };
    return ipcListen(CHANNELS.SEARCH_COMPLETE, onComplete);
  }, []);

  useEffect(() => {
    const showError = (error) => {
      const message = { message: error.message, mode: MESSAGE_MODES_STYLES.error };
      allMessages.current.push(message);
      setProgress(100);
      setHasError(true);
    };
    return ipcListen(CHANNELS.SEARCH_FAIL, showError);
  }, []);

  const barColor = hasError
    ? "error"
    : progress === 100
    ? "success"
    : "primary";

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
        color={barColor}
        variant={
          isRunning
            ? progress
              ? "determinate"
              : "indeterminate"
            : "determinate"
        }
        value={isRunning ? progress : 100}
      />
      <Typography variant="h6" sx={{ py: 2, position: "relative" }}>
        {hasError ? FAILED_SEARCH_HEADING : heading}
        <Tooltip title="Clear output">
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              right: 10,
            }}
            onClick={() => (allMessages.current = [])}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      <Divider />
      <Box sx={{ width: "100%" }}>
        <Console messagesRef={allMessages} />
      </Box>
    </Box>
  );
}

export default Output;
