const fs = require("fs-extra");
const path = require("path");
const {
  METADATA_DIALOG,
  DIALOG_ACTIONS_TYPES,
  ERROR_DIALOG,
} = require("./constants.mjs");

const getFileMetadata = async (file) => {
  const basename = path.basename(file);
  try {
    const metadata = await fs.stat(file);
    const { size, ino, nlink, atimeMs, mtimeMs, birthtimeMs } = metadata;
    const sizeKB = Number(size) / 1000,
      creation = new Date(birthtimeMs).toLocaleString(),
      accessed = new Date(atimeMs).toLocaleString(),
      modified = new Date(mtimeMs).toLocaleString();
    return {
      title: METADATA_DIALOG.title,
      message: [
        METADATA_DIALOG.file.replace("{file}", basename),
        METADATA_DIALOG.size.replace("{size}", sizeKB),
        METADATA_DIALOG.creation.replace("{creation}", creation),
        METADATA_DIALOG.accessed.replace("{accessed}", accessed),
        METADATA_DIALOG.modified.replace("{modified}", modified),
        METADATA_DIALOG.inode.replace("{inode}", ino),
        METADATA_DIALOG.link.replace("{link}", nlink),
      ],
      buttons: [
        {
          label: METADATA_DIALOG.okBtnLabel,
          type: DIALOG_ACTIONS_TYPES.OK,
        },
      ],
    };
  } catch (err) {
    return {
      title: METADATA_DIALOG.titleFailed,
      message: [
        METADATA_DIALOG.file.replace("{file}", basename),
        METADATA_DIALOG.error.replace("{error}", err.message),
      ],
      buttons: [
        {
          label: METADATA_DIALOG.okBtnLabel,
          type: DIALOG_ACTIONS_TYPES.OK,
        },
      ],
    };
  }
};

const readFileContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, "utf8");
    if (/\ufffd/.test(content)) {
      throw new Error("Cannot read a non-text file");
    }
    return { content };
  } catch (err) {
    return {
      error: err,
      message: "Failed to read file: " + err.message,
    };
  }
};

const writeFileContent = async (filePath, content) => {
  let result;
  try {
    await fs.writeFile(filePath, content);
    result = {
      message: "File saved successfully",
    };
  } catch (err) {
    result = {
      error: err,
      message: "Failed to write file: " + err.message,
    };
  } finally {
    return result;
  }
};

const getDialogErrorProps = (message) => {
  return {
    title: ERROR_DIALOG.title,
    message: [ERROR_DIALOG.error.replace("{error}", message)],
    buttons: [
      {
        label: ERROR_DIALOG.dismissBtnLabel,
        type: DIALOG_ACTIONS_TYPES.DISMISS,
      },
    ],
  };
};

module.exports = {
  getFileMetadata,
  readFileContent,
  writeFileContent,
  getDialogErrorProps,
};
