import React, { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import { shallow } from "zustand/shallow";
import useEditor from "../store/useEditor.js";
import { CHANNELS, DIALOG_ACTIONS_TYPES } from "../../constants.mjs";

const { ipcListen, ipcSend } = window.api;

const openUrl = ({ url }) => {
  ipcSend(CHANNELS.OPEN_URL, { url });
};

const getActionButtons = (buttons = [], actions) => {
  return buttons.map((button, index) => {
    return (
      <Button
        key={index}
        onClick={() => {
          actions[button.type](button);
        }}
        autoFocus={button.autoFocus}
      >
        {button.label}
      </Button>
    );
  });
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DialogAlert() {
  const [saveCloseFile, closeFile] = useEditor(
    (state) => [state.saveCloseFile, state.closeFile],
    shallow
  );
  const [dialogQueue, setDialogQueue] = useState([]);
  const [dialogProps, setDialogProps] = useState(null);
  const actions = {
    [DIALOG_ACTIONS_TYPES.OPEN]: ({ url }) => {
      openUrl({ url });
      setDialogProps(null);
    },
    [DIALOG_ACTIONS_TYPES.OK]: () => {
      setDialogProps(null);
    },
    [DIALOG_ACTIONS_TYPES.DISMISS]: () => {
      setDialogProps(null);
    },
    [DIALOG_ACTIONS_TYPES.EDITOR_SAVE_EXIT]: () => {
      saveCloseFile();
      setDialogProps(null);
    },
    [DIALOG_ACTIONS_TYPES.EDITOR_NO_SAVE_EXIT]: () => {
      closeFile();
      setDialogProps(null);
    }
  };

  useEffect(() => {
    const onShowDialog = (props) => {
      setDialogQueue((prev) => [...prev, props]);
    };
    return ipcListen(CHANNELS.OPEN_DIALOG, onShowDialog);
  }, []);

  useEffect(() => {
    if (dialogQueue.length > 0 && !dialogProps) {
      const newDialogQueue = [...dialogQueue];
      const nextDialog = newDialogQueue.shift();
      setDialogProps(nextDialog);
      setDialogQueue(newDialogQueue);
    }
  }, [dialogQueue, dialogProps]);

  const messages = Array.isArray(dialogProps?.message)
    ? dialogProps.message
    : [dialogProps?.message];

  return (
    <Dialog
      TransitionComponent={Transition}
      open={!!dialogProps}
      onClose={() => actions[DIALOG_ACTIONS_TYPES.DISMISS]()}
    >
      {dialogProps && (
        <>
          <DialogTitle>{dialogProps.title}</DialogTitle>
          <DialogContent>
            {messages.map((message, index) => (
              <DialogContentText
                key={index}
                sx={{ whiteSpace: "break-spaces" }}
              >
                {message}
              </DialogContentText>
            ))}
          </DialogContent>
          <DialogActions>
            {getActionButtons(dialogProps.buttons, actions)}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default DialogAlert;
