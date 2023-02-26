export const COMMON_LIBRARY_NAMES = [
  "node_modules",
  "site-packages",
  "vendor",
  "lib",
  "libs",
  "packages",
];

export const MESSAGE_PREFIX = {
  UPDATE: "Updated: ",
  MATCH: "Matched: ",
};

export const MESSAGE_MODES = {
  INFO: "info",
  SUCCESS: "success",
  ERROR: "error",
  UPDATE: "update",
};

export const MESSAGE_MODES_STYLES = {
  SUCCESS: "success.main",
  ERROR: "error.main",
  INFO: "text.primary",
};

export const WORKER_CHANNELS = {
  PROGRESS: "progress",
  TERMINATE: "terminate",
  ERROR: "error",
  CANCEL: "cancel",
};

export const CHANNELS = {
  // Directory
  DIRECTORY_SELECT: "directory:select",
  DIRECTORY_SELECTED: "directory:selected",
  // Search
  SEARCH_START: "search:start",
  SEARCH_PROGRESS: "search:progress",
  SEARCH_CANCEL: "search:cancel",
  SEARCH_COMPLETE: "search:complete",
  SEARCH_FAIL: "search:fail",
  SEARCH_PROCESS_ID: "search:processID",
  // Open
  OPEN_URL: "open:url",
  OPEN_FILE: "open:file",
  OPEN_FOLDER: "open:folder",
  OPEN_DIALOG: "open:dialog",
  // Info
  INFO_PKG_REQUEST: "info:pkg:request",
  INFO_PKG_RESPONSE: "info:pkg:response",
  INFO_CORES_REQUEST: "info:cores:request",
  INFO_CORES_RESPONSE: "info:cores:response",
};

export const DIALOG_ACTIONS_TYPES = {
  OPEN: "open",
  DISMISS: "dismiss",
  OK: "ok",
};

export const SEARCH_MODES = {
  FILE_NAME: "filename",
  FILE_CONTENT: "content",
};

export const SEARCH_TYPES = {
  FILE: "file",
  REPLACE: "replace",
  MATCH: "match",
};

export const STORE_TYPES = {
  STATUS: "status",
  VERSION: "version",
  TOTAL_CONTENT: "totalContent",
  TOTAL_FILE: "totalFile",
  ...SEARCH_TYPES,
};

export const STATUS_TYPES_THRESHOLD = {
  BASE: 100, // 100, 1,000, 10,000
  [STORE_TYPES.TOTAL_CONTENT]: 100, // 10,000, 100,000, 1,000,000
  [STORE_TYPES.TOTAL_FILE]: 1000, // 100,000, 1,000,000, 10,000,000
  [STORE_TYPES.REPLACE]: 10, // 1,000, 10,000, 100,000
  [STORE_TYPES.MATCH]: 10, // 1,000, 10,000, 100,000
  [STORE_TYPES.SEARCH]: 10, // 1,000, 10,000, 100,000
};

export const STATUS_TYPES_MESSAGES = {
  title: "Woohoo! 🤩",
  openBtnLabel: "Sure! ☕",
  dismissBtnLabel: "Maybe later 🥺",
  messageUpdate: "We have got over {count} results so far! 🤯",
  messageTotal: "We have searched through +{count} files so far! 🤯",
};

// hey YOU, yes YOU reading this code! 👋
// Please consider buying the developer (ME) a coffee
export const APPRECIATION_MESSAGES = [
  // generated using chatGPT
  "Whoa, you're loving this app! Let's give the developer a caffeine boost by buying them a coffee. 💡",
  "Having a blast, aren't you? Let's make the developer's day by buying them a coffee. ☕️",
  "Awesome! It seems like you're digging this app. Let's support the developer by buying them a coffee. 💻",
  "Wow, you're really into this app! How about we show the developer some love by buying them a coffee? 💖",
  "Whoop whoop! Looks like you're having a great time. Let's buy the developer a coffee and keep the good vibes rolling. 😎",
  "Awesome-sauce! You seem to be loving the app. How about we buy the developer a coffee and give them a caffeine boost? 🚀",
  "Holy moly, you're enjoying this app! Let's show some support to the developer by buying them a coffee. 🙌",
  "Super cool! It seems like you're having a ball with the app. How about we buy the developer a coffee and show them some love? ❤️",
  "Wowza! You seem to be having the time of your life with this app. Let's buy the developer a coffee and make their day. 🎉",
  "Rocking it! You're loving the app, aren't you? Let's buy the developer a coffee and keep the good times rolling. 🚀",
];

export const CHANGE_LOGS_DIALOG = {
  title: "What's new?",
  dismissBtnLabel: "Ok",
};
