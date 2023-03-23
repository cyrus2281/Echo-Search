import { create } from "zustand";
import { CHANNELS } from "../../constants.mjs";

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

const useEditor = create((set, get) => {
  return {
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
