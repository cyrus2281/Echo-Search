import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import SaveIcon from "@mui/icons-material/Save";

import useEditor from "../../store/useEditor";
import CodeEditor from "./CodeEditor";
import { CHANNELS, DIALOG_ACTIONS_TYPES } from "../../../constants.mjs";
import EditorBottomBar from "./EditorBottomBar";

const { ipcSend, ipcListen } = window.api;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CodeEditorDialog() {
  const open = useEditor((state) => state.isOpen);
  const isDirty = useEditor((state) => state.isDirty);
  const isLoading = useEditor((state) => state.isLoading);
  const filePath = useEditor((state) => state.filePath);
  const setFile = useEditor((state) => state.setFile);
  const closeFile = useEditor((state) => state.closeFile);
  const requestCloseFile = useEditor((state) => state.requestCloseFile);
  const saveFile = useEditor((state) => state.saveFile);
  const fileSaved = useEditor((state) => state.fileSaved);

  useEffect(() => {
    if (!open) return;
    return ipcListen(
      CHANNELS.FILE_READ_RESPONSE,
      async ({ content, ...other }) => {
        if (other.error) {
          console.error("Error:", other.message, other.error);
          closeFile();
          return;
        }
        setFile(content);
      }
    );
  }, [open]);

  useEffect(() => {
    if (!open) return;
    return ipcListen(
      CHANNELS.FILE_WRITE_RESPONSE,
      async ({ message, error }) => {
        if (error) {
          console.error("Error:", message, error);
          return;
        }
        fileSaved();
      }
    );
  }, [open]);

  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={requestCloseFile}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          {!isLoading && (
            <>
              <Typography
                sx={{ m: 2, flex: 1, direction: "rtl", textAlign: "left" }}
                variant="h6"
                component="div"
                noWrap
              >
                {filePath}
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={() => saveFile()}
                disabled={!isDirty}
              >
                <SaveIcon sx={{ pr: 0.5 }} />
                save
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ height: "calc(100% - 26px)" }}>
        {!isLoading && open && <CodeEditor />}
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              fontSize: "1.5rem",
            }}
          >
            Loading File...
            <CircularProgress size="4rem" />
          </Box>
        )}
      </Box>
      <EditorBottomBar />
    </Dialog>
  );
}

export default CodeEditorDialog;
