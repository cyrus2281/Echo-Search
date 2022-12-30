const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  ipcSend: (channel, data) => {
    ipcRenderer.send(channel, data);
  },

  ipcListen: (channel, func) => {
    const safeFunc = (event, ...args) => func(...args);
    const unsubscribe =  ipcRenderer.on(channel, safeFunc);
    return () => unsubscribe.removeListener(channel, safeFunc)
  },
});
