const path = require('path');
const { app, BrowserWindow, ipcMain, dialog, Menu} = require('electron');
const echoSearch = require('./echo-search');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 1000,
    minWidth:600,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js") // use a preload script
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

Menu.setApplicationMenu(null);

app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("directory:select", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    buttonLabel: "Select directory",
    title: "Parent directory for recursive search"
  })
  if (result.filePaths && result.filePaths.length) {
    mainWindow.webContents.send('directory:selected', result.filePaths[0])
  }
});

ipcMain.on("search:start", async (e, query) => {
  if (query) {
    const onError = (error) => mainWindow.webContents.send('search:error', error);
    const onProgress = (progress) => mainWindow.webContents.send('search:progress', progress);
    const onComplete = (message) => mainWindow.webContents.send('search:complete', message);
    echoSearch(query, onComplete, onError, onProgress);
  }
});
