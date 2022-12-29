import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const { ipcSend, ipcListen } = window.api;

const getMode = (mode) => {
  switch (mode) {
    case "success":
      return "success.main";
    case "error":
      return "error.main";
    default:
      return "text.primary";
  }
};

function Output({ isRunning }) {
  // due to async nature of useState, we might miss some messages
  const allMessages = useRef([]);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [heading, setHeading] = useState("Searching for files...");
  const [messages, setMessages] = React.useState([]);

  useEffect(() => {
    const showProgress = (update) => {
      const progress = update.progress;
      const message = { message: update.message, mode: getMode(update.mode) };
      allMessages.current.push(message);
      if (progress) {
        const heading = `Updating files. ${progress}% completed.`;
        setHeading(heading);
        setProgress(progress);
      }
      setMessages([...allMessages.current]);
    };
    return ipcListen("search:progress", showProgress);
  }, [messages]);

  useEffect(() => {
    const onComplete = (event) => {
      const message = { message: event.message, mode: getMode("success") };
      allMessages.current.push(message);
      setHeading("All Done!");
      setProgress(100);
      setMessages([...allMessages.current]);
    };
    return ipcListen("search:complete", onComplete);
  }, [messages]);

  useEffect(() => {
    const showError = (error) => {
      const message = { message: error.message, mode: getMode("error") };
      allMessages.current.push(message);
      setHeading("Operation was not completely successful.");
      setProgress(100);
      setHasError(true);
      setMessages([...allMessages.current]);
    };
    return ipcListen("search:fail", showError);
  }, [messages]);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
        color={hasError ? "error" : "primary"}
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
        {heading}
      </Typography>
      <Divider />
      <Box sx={{ width: "100%" }}>
        <List
          dense={true}
          sx={{
            maxHeight: 300,
            overflow: "auto",
            pt: 2,
            pl: 2,
          }}
        >
          {messages.map((msg, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ color: msg.mode }} primary={msg.message} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default Output;
