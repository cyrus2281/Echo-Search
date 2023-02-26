import React, { useEffect, useRef } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";
import { VariableSizeList as List } from "react-window";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import { CHANNELS, MESSAGE_PREFIX } from "../../constants.mjs";

const { ipcSend } = window.api;

const getItemTextStyle = (msg) => {
  const style = {
    color: msg.mode,
    wordBreak: "break-all",
    fontFamily: "'Roboto Mono', monospace",
  };
  if (msg.isFile) {
    style.cursor = "pointer";
    style["&:hover"] = {
      textDecoration: "underline",
    };
  }
  return style;
};

const openFile = (msg, inFolder) => {
  let filePath;
  const request = inFolder ? CHANNELS.OPEN_FOLDER : CHANNELS.OPEN_FILE;
  if (msg.includes(MESSAGE_PREFIX.UPDATE)) {
    filePath = msg.replace(MESSAGE_PREFIX.UPDATE, "");
  } else if (msg.includes(MESSAGE_PREFIX.MATCH)) {
    filePath = msg.replace(MESSAGE_PREFIX.MATCH, "");
  } else {
    filePath = msg;
  }
  ipcSend(request, { filePath });
};

function renderRow(props) {
  const { data, index, style } = props;
  const msg = data[index];

  return (
    <ListItem
      sx={{
        ...style,
        top: style.top + 10,
        padding: "8px",
      }}
      key={index}
      disablePadding
    >
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
                <IconButton size="small" onClick={() => openFile(msg.message)}>
                  <FileIcon fontSize="8" />
                </IconButton>
              </Tooltip>
            </>
          )
        }
      >
        {/* <ListItemText sx={getItemTextStyle(msg)} primary={msg.message} /> */}
        <Typography variant="body1" sx={getItemTextStyle(msg)}>
          {msg.message}
        </Typography>
      </Tooltip>
    </ListItem>
  );
}

function Console({ messagesRef, listControlRef }) {
  // to prevent recreating the interval on message update
  const lastMeasuredLength = useRef(0);
  const boxRef = useRef();
  const listRef = useRef();
  const [messages, setMessages] = React.useState([]);
  lastMeasuredLength.current = messages.length;

  listControlRef.current.scrollToEnd = () => {
    listRef.current.scrollToItem(messages.length - 1, "smart");
  }

  useEffect(() => {
    // To prevent the renderer from freezing/slowing down,
    // due to the flood of messages, updating 4 times a second.
    const interval = setInterval(() => {
      if (messagesRef.current.length !== lastMeasuredLength.current) {
        setMessages([...messagesRef.current]);
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      ref={boxRef}
      sx={{
        width: "100%",
        height: 300,
        bgcolor: "#080716",
        borderRadius: "5px",
        px: 0.5,
      }}
    >
      <List
        ref={listRef}
        height={300}
        width={"100%"}
        itemSize={(index) => {
          const maxWidth = boxRef.current.offsetWidth - 12;
          const maxCharacters = Math.floor(maxWidth / 10);
          const msgLength = messages[index].message.length;
          const extraLines = Math.ceil(msgLength / maxCharacters) - 1;
          const totalHeight = 40 + extraLines * 24;
          return totalHeight;
        }}
        estimatedItemSize={40}
        itemCount={messages.length}
        itemData={messages}
        overscanCount={5}
      >
        {renderRow}
      </List>
    </Box>
  );
}

export default Console;
