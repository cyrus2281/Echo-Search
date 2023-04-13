const Store = require("electron-store");
const {
  STORE_TYPES,
  STATUS_TYPES_THRESHOLD,
  STATUS_TYPES_MESSAGES,
  DIALOG_ACTIONS_TYPES,
  APPRECIATION_MESSAGES,
  CHANGE_LOGS_DIALOG,
  SEARCH_TYPES,
  SEARCH_MODES,
} = require("./constants.mjs");
const changelogs = require("./changelogs.js");

// Store
const store = new Store({
  name: "echo-search.config",
  fileExtension: "bin",
  encryptionKey: "echo-search",
  clearInvalidConfig: true,
});

const writeToStore = (key, value) => {
  store.set(key, value);
};

const readFromStore = (key) => {
  return store.get(key);
};

const updateVersion = () => {
  const { version } = process.env.PACKAGE;
  const newVersion = "v" + version.slice(0, version.lastIndexOf("."));
  const prevVersion = readFromStore(STORE_TYPES.VERSION);
  if (prevVersion !== newVersion) {
    writeToStore(STORE_TYPES.VERSION, newVersion);
    const prevTotal = readFromStore(
      `${STORE_TYPES.STATUS}.${STORE_TYPES.TOTAL_CONTENT}`
    );
    const hasUsedApp = !!prevVersion || !!prevTotal;
    if (hasUsedApp) {
      const versionIndex = Math.max(
        changelogs.findIndex((log) => log.version === prevVersion),
        // version <=v2.4 was not stored
        changelogs.findIndex((log) => log.version == "v2.4")
      );
      const updateLogs = changelogs
        .slice(0, versionIndex)
        .map((log) => {
          return [
            `Release ${log.version} - ${log.released}`,
            ...log.logs.map((log) => `  - ${log}`),
            "  ", // new line
          ];
        })
        .flat();

      return {
        title: CHANGE_LOGS_DIALOG.title,
        message: updateLogs,
        buttons: [
          {
            label: CHANGE_LOGS_DIALOG.dismissBtnLabel,
            type: DIALOG_ACTIONS_TYPES.DISMISS,
          },
        ],
      };
    }
  }
};

const storeStatusUpdate = ({
  totalCount = 0,
  updatedCount = 0,
  searchType,
}) => {
  // total key name
  const TOTAL_KEY =
    searchType === SEARCH_TYPES.FILE_NAME
      ? STORE_TYPES.TOTAL_FILE
      : STORE_TYPES.TOTAL_CONTENT;
  // previous values
  const prevTotal = readFromStore(`${STORE_TYPES.STATUS}.${TOTAL_KEY}`) || 0;
  const prevUpdate = readFromStore(`${STORE_TYPES.STATUS}.${searchType}`) || 0;
  // new values
  const newTotal = totalCount + prevTotal;
  const newUpdate = updatedCount + prevUpdate;
  // update values
  writeToStore(`${STORE_TYPES.STATUS}.${TOTAL_KEY}`, newTotal);
  writeToStore(`${STORE_TYPES.STATUS}.${searchType}`, newUpdate);
  // Calculate thresholds
  const base = STATUS_TYPES_THRESHOLD.BASE;
  const thresholds = [
    base * 1 * STATUS_TYPES_THRESHOLD[searchType],
    base * 10 * STATUS_TYPES_THRESHOLD[searchType],
    base * 100 * STATUS_TYPES_THRESHOLD[searchType],
    base * 1 * STATUS_TYPES_THRESHOLD[TOTAL_KEY],
    base * 10 * STATUS_TYPES_THRESHOLD[TOTAL_KEY],
    base * 100 * STATUS_TYPES_THRESHOLD[TOTAL_KEY],
  ];
  // check thresholds and update message
  const message = [];
  for (let i = 0; i < thresholds.length; i++) {
    const prev = i > 2 ? prevTotal : prevUpdate;
    const curr = i > 2 ? newTotal : newUpdate;
    if (curr > thresholds[i] && prev <= thresholds[i]) {
      message.push(
        (i > 2
          ? STATUS_TYPES_MESSAGES.messageTotal
          : STATUS_TYPES_MESSAGES.messageUpdate
        ).replace("{count}", thresholds[i].toLocaleString())
      );
      message.push(
        APPRECIATION_MESSAGES[
          Math.floor(Math.random() * APPRECIATION_MESSAGES.length)
        ]
      );
      break;
    }
  }
  // show dialog if threshold is reached
  if (message.length) {
    return {
      title: STATUS_TYPES_MESSAGES.title,
      message,
      buttons: [
        {
          label: STATUS_TYPES_MESSAGES.dismissBtnLabel,
          type: DIALOG_ACTIONS_TYPES.DISMISS,
        },
        {
          label: STATUS_TYPES_MESSAGES.openBtnLabel,
          type: DIALOG_ACTIONS_TYPES.OPEN,
          url: process.env.PACKAGE?.buyMeACoffee?.url,
          autoFocus: true,
        },
      ],
    };
  }
  return null;
};

const setSearchMode = (mode = SEARCH_MODES.FILE_CONTENT) => {
  writeToStore(STORE_TYPES.SEARCH_MODE, mode);
};

const getSearchMode = () => {
  return readFromStore(STORE_TYPES.SEARCH_MODE) || SEARCH_MODES.FILE_CONTENT;
};

const storeProfiles = (profiles) => {
  writeToStore(STORE_TYPES.PROFILES, profiles);
};

const getProfiles = () => {
  return readFromStore(STORE_TYPES.PROFILES) || [];
};

module.exports = {
  writeToStore,
  readFromStore,
  storeStatusUpdate,
  updateVersion,
  setSearchMode,
  getSearchMode,
  storeProfiles,
  getProfiles,
};
