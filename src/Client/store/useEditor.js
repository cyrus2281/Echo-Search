import { create } from "zustand";
import { CHANNELS, DIALOG_ACTIONS_TYPES } from "../../constants.mjs";

const { ipcSend } = window.api;

const initialState = {
  isOpen: false,
  isLoading: false,
  filePath: "",
  initialFileContent: "",
  fileContent: "",
  language: "",
  availableLanguages: [],
  isDirty: false,
  closeOnSave: false,
};

const editorOptions = {
  fontSize: 18,
  wordWrap: false,
};

const useEditor = create((set, get) => {
  return {
    ...editorOptions,
    ...initialState,
    // setters
    setIsOpen: (isOpen) => set({ isOpen }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setFilePath: (filePath) => set({ filePath }),
    setInitialFileContent: (initialFileContent) =>
      set({ initialFileContent, isDirty: false }),
    setFileContent: (fileContent) => {
      const { initialFileContent } = get();
      set({
        fileContent,
        isDirty: initialFileContent !== fileContent,
      });
    },
    setIsDirty: (isDirty) => set({ isDirty }),
    setLanguage: (language, availableLanguages) => {
      if (availableLanguages) {
        set({ language, availableLanguages });
      } else {
        set({ language });
      }
    },
    // editor options setters
    setFontSize: (fontSize) => set({ fontSize }),
    changeFontSize: (increase = true) => {
      const { fontSize } = get();
      if (increase && fontSize < 36) {
        set({ fontSize: fontSize + 2 });
      } else if (!increase && fontSize > 8) {
        set({ fontSize: fontSize - 2 });
      }
    },
    setWordWrap: (wordWrap) => set({ wordWrap }),
    toggleWordWrap: () => {
      const { wordWrap } = get();
      set({ wordWrap: !wordWrap });
    },

    // functions
    openFile: (filePath) => {
      set({ ...initialState, filePath, isOpen: true, isLoading: true });
      ipcSend(CHANNELS.FILE_READ_REQUEST, { filePath });
    },
    setFile: (fileContent) => {
      const { isOpen, isLoading } = get();
      if (isOpen && isLoading) {
        set({
          initialFileContent: fileContent,
          isLoading: false,
          isDirty: false,
        });
      }
    },
    saveFile: () => {
      const { filePath, fileContent } = get();
      ipcSend(CHANNELS.FILE_WRITE_REQUEST, { filePath, fileContent });
    },
    fileSaved: () => {
      const { fileContent, closeOnSave, closeFile } = get();
      if (closeOnSave) {
        closeFile();
        return;
      }
      set({ initialFileContent: fileContent, isDirty: false });
    },
    closeFile: () => {
      set({ ...initialState });
    },
    requestCloseFile: () => {
      const { isDirty, filePath, closeFile } = get();
      if (isDirty) {
        ipcSend(CHANNELS.OPEN_DIALOG, {
          title: "There are unsaved changes!",
          message: [
            "Do you want to save the changes before closing?",
            `Modifying: ${filePath}`,
          ],
          buttons: [
            {
              label: "Cancel",
              type: DIALOG_ACTIONS_TYPES.DISMISS,
            },
            {
              label: "Close without saving",
              type: DIALOG_ACTIONS_TYPES.EDITOR_NO_SAVE_EXIT,
              autoFocus: true,
            },
            {
              label: "Save and close",
              type: DIALOG_ACTIONS_TYPES.EDITOR_SAVE_EXIT,
            },
          ],
        });
      } else {
        closeFile();
      }
    },
    saveCloseFile: () => {
      const { isDirty, saveFile, closeFile } = get();
      if (isDirty) {
        set({ closeOnSave: true });
        saveFile(true);
      } else {
        closeFile();
      }
    },
  };
});

export default useEditor;
