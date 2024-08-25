const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("BatteryStatus", {
  // status: () =>
  //   ipcRenderer.invoke("status").then((result) => {
  //     return result;
  //   }),
  status: () => ipcRenderer.invoke("status"),

  // Electron Specific **Imp
  // onStatusUpdate: (callback) =>
  //   ipcRenderer.on("battery-status-update", callback),
});
