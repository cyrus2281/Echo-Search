import { MESSAGE_MODES, MESSAGE_MODES_STYLES, SEARCH_MODES } from "../constants.mjs";
import { defaultRegexFlagsValues } from "./Components/RegexFlags";

export const validateFileNameForm = (form) => {
  const errors = [];
  if (!form.current.directories?.length) {
    errors.push("You at least need a directory to search in.");
  }
  if (!form.current.query?.searchQuery?.trim()) {
    errors.push("You need a file name.");
  }
  return errors;
};

export const validateFileContentForm = (form) => {
  const errors = [];
  if (!form.current.directories?.length) {
    errors.push("You at least need a directory to search in.");
  }
  if (!form.current.query?.searchQuery?.trim()) {
    errors.push("You need a search query.");
  }
  if (
    form.current.query?.replaceQuery !== false && // search only
    !form.current.query?.replaceQuery?.trim()
  ) {
    errors.push("You need a replace query.");
  }
  return errors;
};

export const validateForm = (form, mode) => {
  switch (mode) {
    case SEARCH_MODES.FILE_NAME:
      return validateFileNameForm(form);
    case SEARCH_MODES.FILE_CONTENT:
    default:
      return validateFileContentForm(form);
  }
};

export const getFormDefaults = (mode) => {
  switch (mode) {
    case SEARCH_MODES.FILE_NAME:
      return { query: {}, searchMode: SEARCH_MODES.FILE_NAME };
    case SEARCH_MODES.FILE_CONTENT:
    default:
      return {
        query: { regexFlags: [...defaultRegexFlagsValues] },
        searchMode: SEARCH_MODES.FILE_CONTENT,
      };
  }
};

export const getProgressBarMode = (isRunning, mode, progress) => {
  if (!isRunning) return "determinate";
  if (mode === SEARCH_MODES.FILE_NAME) return "indeterminate";
  if (progress) return "determinate";
  return "indeterminate";
};

export const getProgressBarColor = (hasError, progress) => {
  if (hasError) return "error";
  if (progress === 100) return "success";
  return "primary";
};

export const getMessage = (msg) => {
  let message = msg.message;
  let mode, isFile;
  switch (msg.mode) {
    case MESSAGE_MODES.SUCCESS:
      mode = MESSAGE_MODES_STYLES.SUCCESS;
      break;
    case MESSAGE_MODES.ERROR:
      mode = MESSAGE_MODES_STYLES.ERROR;
      break;
    case MESSAGE_MODES.UPDATE:
      mode = MESSAGE_MODES_STYLES.INFO;
      isFile = true;
      break;
    default:
      mode = MESSAGE_MODES_STYLES.INFO;
  }
  return {
    message,
    mode,
    isFile,
  };
};
