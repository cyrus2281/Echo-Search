import React, { useEffect } from "react";

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
import useDialog from "../store/useDialog.js";

const { ipcListen, ipcSend } = window.api;

const openUrl = ({ url }) => {
  ipcSend(CHANNELS.OPEN_URL, { url });
};

const getActionButtons = (buttons = [], actions, closeDialog) => {
  return buttons.map((button, index) => {
    return (
      <Button
        key={index}
        onClick={() => {
          if (typeof button.action === "function") {
            button.action();
          } else if (actions[button.type]) {
            actions[button.type](button);
          }
          closeDialog();
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
  const [currentDialog, closeDialog, addToDialogQueue] = useDialog(
    (state) => [state.currentDialog, state.closeDialog, state.addToDialogQueue],
    shallow
  );
  const actions = {
    [DIALOG_ACTIONS_TYPES.OPEN]: ({ url }) => {
      openUrl({ url });
    },
    [DIALOG_ACTIONS_TYPES.EDITOR_SAVE_EXIT]: () => {
      saveCloseFile();
    },
    [DIALOG_ACTIONS_TYPES.EDITOR_NO_SAVE_EXIT]: () => {
      closeFile();
    },
  };

  useEffect(() => {
    const onShowDialog = (props) => {
      addToDialogQueue(props);
    };
    return ipcListen(CHANNELS.OPEN_DIALOG, onShowDialog);
  }, []);

  const messages = Array.isArray(currentDialog?.message)
    ? currentDialog.message
    : [currentDialog?.message];

  return (
    <Dialog
      TransitionComponent={Transition}
      open={!!currentDialog}
      onClose={closeDialog}
    >
      {currentDialog && (
        <>
          <DialogTitle>{currentDialog.title}</DialogTitle>
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
            {getActionButtons(currentDialog.buttons, actions, closeDialog)}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default DialogAlert;
