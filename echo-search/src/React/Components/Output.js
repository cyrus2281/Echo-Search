import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const { ipcSend, ipcListen } = window.api;

function Output({ isRunning }) {
  // due to async nature of useState, we might miss some messages
  const allMessages = useRef([]);
  const [progress, setProgress] = useState(0);
  const [heading, setHeading] = useState("Searching for files...");
  const [messages, setMessages] = React.useState([]);

  useEffect(() => {
    const showProgress = (update) => {
      const progress = update.progress;
      const heading = `Updating files. ${progress}% completed.`;
      const newMessages = [{ message: update.message, isError: false }];
      if (messages.length === 0) {
        newMessages.unshift({
          message: `Found ${update.totalFiles} files.`,
          isError: false,
        });
      }
      allMessages.current.push(...newMessages);
      setHeading(heading);
      setProgress(progress);
      setMessages([...allMessages.current]);
    };
    return ipcListen("search:progress", showProgress);
  }, [messages]);

  useEffect(() => {
    const showError = (error) => {
      const message = { message: error.message, isError: true };
      allMessages.current.push(message);
      setMessages([...allMessages.current]);
    };
    return ipcListen("search:error", showError);
  }, [messages]);

  useEffect(() => {
    const onComplete = (event) => {
      const message = { message: event.message, isError: false };
      allMessages.current.push(message);
      setHeading("All Done!");
      setProgress(100);
      setMessages([...allMessages.current]);
    };
    return ipcListen("search:complete", onComplete);
  }, [messages]);

  console.log(progress, isRunning);
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
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
              <ListItemText
                sx={{ color: msg.isError ? "error.main" : "text.primary" }}
                primary={msg.message}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default Output;
