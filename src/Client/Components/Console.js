import React, { useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";

const { ipcSend } = window.api;

const MESSAGE_PREFIX = {
  update: "Updated: ",
  match: "Matched: ",
};

const getItemTextStyle = (msg) => {
    const style = {
        color: msg.mode,
        wordBreak: "break-all",
    }
    if (msg.isFile) {
        style.cursor = "pointer";
        style["&:hover"] = {
            textDecoration: "underline",
        }
    }
    return style;    
}

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

function Console({ messagesRef }) {
  const [messages, setMessages] = React.useState([]);

  useEffect(() => {
    // To prevent the renderer from freezing/slowing down,
    // due to the flood of messages, updating 3 times a second.
    const interval = setInterval(() => {
      if (messagesRef.current.length !== messages.length) {
        setMessages(messagesRef.current);
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
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
              sx={getItemTextStyle(msg)}
              primary={msg.message}
            />
          </Tooltip>
        </ListItem>
      ))}
    </List>
  );
}

export default Console;
