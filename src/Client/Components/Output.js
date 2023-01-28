import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Console from "./Console";

const { ipcListen } = window.api;

const FAILED_SEARCH_HEADING = "Operation was not completely successful.";
const MESSAGE_MODES = {
  success: "success.main",
  error: "error.main",
  info: "text.primary",
};

const getMessage = (msg) => {
  let message = msg.message;
  let mode, isFile;
  switch (msg.mode) {
    case "success":
      mode = MESSAGE_MODES.success;
      break;
    case "error":
      mode = MESSAGE_MODES.error;
      break;
    case "update":
      mode = MESSAGE_MODES.info;
      isFile = true;
      break;
    case "match":
      mode = MESSAGE_MODES.info;
      isFile = true;
      break;
    default:
      mode = MESSAGE_MODES.info;
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
      if (update.mode === "error" && update.error) {
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
    return ipcListen("search:progress", showProgress);
  }, []);

  useEffect(() => {
    const onComplete = (event) => {
      const message = { message: event.message, mode: MESSAGE_MODES.success };
      allMessages.current.push(message);
      setHeading("All Done!");
      setProgress(100);
    };
    return ipcListen("search:complete", onComplete);
  }, []);

  useEffect(() => {
    const showError = (error) => {
      const message = { message: error.message, mode: MESSAGE_MODES.error };
      allMessages.current.push(message);
      setProgress(100);
      setHasError(true);
    };
    return ipcListen("search:fail", showError);
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
      <Typography variant="h6" sx={{ py: 2 }}>
        {hasError ? FAILED_SEARCH_HEADING : heading}
      </Typography>
      <Divider />
      <Box sx={{ width: "100%" }}>
        <Console  messagesRef={allMessages}/>
      </Box>
    </Box>
  );
}

export default Output;
