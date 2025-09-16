// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', { 
  closeApp: () => ipcRenderer.send("close-app"),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});
