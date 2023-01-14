/**
 *   Echo Search <Electron>
 *
 *   An application to search and replace strings in files recursively
 *
 *   author: Cyrus Mobini
 *
 *   Licensed under the MIT license.
 *   http://www.opensource.org/licenses/mit-license.php
 *
 *   Copyright 2023 Cyrus Mobini (https://github.com/cyrus2281)
 *
 *
 */

const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
  shell,
  MenuItem,
} = require("electron");
const { echoSearch } = require("./EchoSearch/echo-search.mjs");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const isDev = process.env.NODE_ENV === "development";

let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 1000,
    minWidth: 600,
    minHeight: 500,
    icon: "icons/icon.png",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
};

const menu = new Menu();
menu.append(
  new MenuItem({
    role: "editMenu",
  })
);
Menu.setApplicationMenu(menu);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const processes = {};

ipcMain.on("directory:select", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    buttonLabel: "Select directory",
    title: "Parent directory for recursive search",
  });
  if (result.filePaths && result.filePaths.length) {
    mainWindow.webContents.send("directory:selected", result.filePaths[0]);
  }
});

ipcMain.on("search:start", async (e, query) => {
  if (query) {
    const processID = "process-" + Date.now().toString();

    const onError = (error) => {
      mainWindow.webContents.send("search:fail", error);
      delete processes[processID];
    };
    const onProgress = (progress) => {
      mainWindow.webContents.send("search:progress", progress);
    };
    const onComplete = (message) => {
      mainWindow.webContents.send("search:complete", message);
      delete processes[processID];
    };
    const { search, cancel } = echoSearch(
      query,
      onComplete,
      onError,
      onProgress
    );
    processes[processID] = {
      cancel,
    };
    mainWindow.webContents.send("search:processID", { processID });
    await search();
  }
});

ipcMain.on("search:cancel", async (e, { processID }) => {
  if (processID && processes[processID] && processes[processID].cancel) {
    processes[processID].cancel();
  }
});

ipcMain.on("open:url", async (e, { url }) => {
  url && shell.openExternal(url);
});

ipcMain.on("info:pkg:request", async () => {
  mainWindow.webContents.send("info:pkg:response", process.env.PACKAGE);
});
