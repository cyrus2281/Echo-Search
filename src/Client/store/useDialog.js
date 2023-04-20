import { create } from "zustand";

const useDialog = create((set, get) => {
  return {
    dialogQueue: [],
    currentDialog: null,

    closeDialog: () => {
      const { dialogQueue } = get();
      if (dialogQueue.length) {
        const newQueue = [...dialogQueue];
        const currentDialog = newQueue.shift();
        set({ currentDialog, dialogQueue: newQueue });
      } else {
        set({ currentDialog: null });
      }
    },

    addToDialogQueue: (dialogProps) => {
      const { dialogQueue, currentDialog } = get();
      const newQueue = [...dialogQueue, dialogProps];
      const state = {};
      if (!currentDialog) {
        state.currentDialog = newQueue.shift();
      }
      state.dialogQueue = newQueue;
      set({ ...state });
    },
  };
});

export default useDialog;
