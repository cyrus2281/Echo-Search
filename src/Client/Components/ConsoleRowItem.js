import React from "react";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";

import { CHANNELS, MESSAGE_PREFIX } from "../../constants.mjs";
import useEditor from "../store/useEditor.js";

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

const getFilePathFromMessage = (msg) => {
  let filePath;
  if (msg.includes(MESSAGE_PREFIX.UPDATE)) {
    filePath = msg.replace(MESSAGE_PREFIX.UPDATE, "");
  } else if (msg.includes(MESSAGE_PREFIX.MATCH)) {
    filePath = msg.replace(MESSAGE_PREFIX.MATCH, "");
  } else {
    filePath = msg;
  }
  return filePath;
};

const openFile = (msg, inFolder) => {
  const filePath = getFilePathFromMessage(msg);
  const request = inFolder ? CHANNELS.OPEN_FOLDER : CHANNELS.OPEN_FILE;
  ipcSend(request, { filePath });
};

const requestFileMetadata = (msg) => {
  const filePath = getFilePathFromMessage(msg);
  ipcSend(CHANNELS.INFO_METADATA_REQUEST, { filePath });
};

function ConsoleRowItem(props) {
  const { data, index, style } = props;
  const msg = data[index];
  const openFileInEditor = useEditor((state) => state.openFile);

  const openInEditor = (msg) => {
    const filePath = getFilePathFromMessage(msg);
    openFileInEditor(filePath);
  };

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
        leaveDelay={100}
        title={
          msg.isFile && (
            <>
              <Tooltip title="Open file in built-in code editor. (For text-base files ONLY)">
                <IconButton onClick={() => openInEditor(msg.message)}>
                  <EditIcon fontSize="8" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Open file in the desktop's default manner. Similar to double clicking on the file.">
                <IconButton onClick={() => openFile(msg.message)}>
                  <FileIcon fontSize="8" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Open folder in the file manager.">
                <IconButton onClick={() => openFile(msg.message, true)}>
                  <FolderIcon fontSize="8" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Get file metadata.">
                <IconButton onClick={() => requestFileMetadata(msg.message)}>
                  <InfoIcon fontSize="8" />
                </IconButton>
              </Tooltip>
            </>
          )
        }
      >
        <Typography variant="body1" sx={getItemTextStyle(msg)}>
          {msg.message}
        </Typography>
      </Tooltip>
    </ListItem>
  );
}

export default ConsoleRowItem;
