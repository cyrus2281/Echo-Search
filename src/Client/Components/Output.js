import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";

const { ipcListen, ipcSend } = window.api;

const FAILED_SEARCH_HEADING = "Operation was not completely successful.";
const MESSAGE_MODES = {
  success: "success.main",
  error: "error.main",
  info: "text.primary",
};
const MESSAGE_PREFIX = {
  update: "Updated: ",
  match: "Matched: ",
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

const openFile = (msg, inFolder) => {
  let filePath;
  const request = inFolder ? "open:folder" : "open:file";
  if (msg.includes(MESSAGE_PREFIX.update)) {
    filePath = msg.replace(MESSAGE_PREFIX.update, "");
  } else if (msg.includes(MESSAGE_PREFIX.match)) {
    filePath = msg.replace(MESSAGE_PREFIX.match, "");
  } else {
    filePath = msg;
  }
  ipcSend(request, { filePath });
};

function Output({ isRunning }) {
  // due to async nature of useState, we might miss some messages, using ref
  const allMessages = useRef([]);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [heading, setHeading] = useState("Searching for files...");
  const [messages, setMessages] = React.useState([]);

  useEffect(() => {
    const showProgress = (update) => {
      const progress = update.progress;
      if (update.message) {
        const message = getMessage(update);
        allMessages.current.push(message);
        setMessages([...allMessages.current]);
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
      setMessages([...allMessages.current]);
    };
    return ipcListen("search:complete", onComplete);
  }, []);

  useEffect(() => {
    const showError = (error) => {
      const message = { message: error.message, mode: MESSAGE_MODES.error };
      allMessages.current.push(message);
      setProgress(100);
      setHasError(true);
      setMessages([...allMessages.current]);
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
        <List
          dense={true}
          sx={{
            maxHeight: 300,
            overflow: "auto",
            pt: 2,
          }}
        >
          {messages.map((msg, i) => (
            <ListItem key={i}>
              <Tooltip
                placement="bottom-start"
                arrow
                title={
                  msg.isFile && (
                    <>
                      <Tooltip title="Open folder in the file manager.">
                        <IconButton
                          size="small"
                          onClick={() => openFile(msg.message, true)}
                        >
                          <FolderIcon fontSize="8" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Open file in the desktop's default manner. Similar to double clicking on the file.">
                        <IconButton
                          size="small"
                          onClick={() => openFile(msg.message)}
                        >
                          <FileIcon fontSize="8" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )
                }
              >
                <ListItemText
                  sx={{
                    color: msg.mode,
                    wordBreak: "break-all",
                    cursor: "default",
                  }}
                  primary={msg.message}
                />
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default Output;
