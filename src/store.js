const Store = require("electron-store");
const {
  STORE_TYPES,
  STATUS_TYPES_THRESHOLD,
  STATUS_TYPES_MESSAGES,
  DIALOG_ACTIONS_TYPES,
  APPRECIATION_MESSAGES,
} = require("./constants.mjs");

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

const storeStatusUpdate = ({ totalCount, updatedCount, searchType }) => {
  // previous values
  const prevTotal =
    readFromStore(`${STORE_TYPES.STATUS}.${STORE_TYPES.TOTAL_CONTENT}`) || 0;
  const prevUpdate = readFromStore(`${STORE_TYPES.STATUS}.${searchType}`) || 0;
  // new values
  const newTotal = totalCount + prevTotal;
  const newUpdate = updatedCount + prevUpdate;
  // update values
  writeToStore(`${STORE_TYPES.STATUS}.${STORE_TYPES.TOTAL_CONTENT}`, newTotal);
  writeToStore(`${STORE_TYPES.STATUS}.${searchType}`, newUpdate);
  // Calculate thresholds
  const base = STATUS_TYPES_THRESHOLD.BASE;
  const thresholds = [
    base * 1 * STATUS_TYPES_THRESHOLD[searchType],
    base * 10 * STATUS_TYPES_THRESHOLD[searchType],
    base * 100 * STATUS_TYPES_THRESHOLD[searchType],
    base * 1 * STATUS_TYPES_THRESHOLD[STORE_TYPES.TOTAL_CONTENT],
    base * 10 * STATUS_TYPES_THRESHOLD[STORE_TYPES.TOTAL_CONTENT],
    base * 100 * STATUS_TYPES_THRESHOLD[STORE_TYPES.TOTAL_CONTENT],
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
    return (dialogProps = {
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
    });
  }
  return null;
};

module.exports = {
  writeToStore,
  readFromStore,
  storeStatusUpdate,
};
