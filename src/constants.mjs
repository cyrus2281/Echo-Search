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

export const WORKER_CHANNELS = {
  PROGRESS: "progress",
  TERMINATE: "terminate",
  ERROR: "error",
  CANCEL: "cancel",
}

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
    // Info
    INFO_PKG_REQUEST: "info:pkg:request",
    INFO_PKG_RESPONSE: "info:pkg:response",
    INFO_CORES_REQUEST: "info:cores:request",
    INFO_CORES_RESPONSE: "info:cores:response",
}
