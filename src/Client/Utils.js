import {
  MESSAGE_MODES,
  MESSAGE_MODES_STYLES,
  SEARCH_MODES,
} from "../constants.mjs";

export const validateFileNameForm = (form) => {
  const errors = [];
  if (!form.directories?.length) {
    errors.push("You at least need a directory to search in.");
  }
  if (!form.query?.searchQuery?.trim()) {
    errors.push("You need a file name.");
  }
  return errors;
};

export const validateFileContentForm = (form) => {
  const errors = [];
  if (!form.directories?.length) {
    errors.push("You at least need a directory to search in.");
  }
  if (!form.query?.searchQuery?.trim()) {
    errors.push("You need a search query.");
  }
  if (
    form.query?.replaceQuery !== false && // search only
    !form.query?.replaceQuery?.trim()
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

export const saveToLocalStorage = (key, value) => {
  const jsonValue = JSON.stringify(value);
  localStorage.setItem(key, jsonValue);
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  const jsonValue = localStorage.getItem(key);
  return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
};

export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const getRegexFlagsArray = (flags) => {
  const regexFlags = [];
  flags.global && regexFlags.push("g");
  flags.multiline && regexFlags.push("m");
  flags.insensitive && regexFlags.push("i");
  flags.unicode && regexFlags.push("u");
  flags.sticky && regexFlags.push("y");
  flags.single && regexFlags.push("s");
  return regexFlags;
};

export const getExistingElements = (object, patternObject) => {
  const newObject = {};
  for (const key in patternObject) {
    if (object[key] !== undefined) {
      newObject[key] = object[key];
    }
  }
  return newObject;
};

export const generateID = () => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let id = "";
  for (let i = 0; i < 32; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
};

export const ellipsisText = (text, maxLength = 80) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};