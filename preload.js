const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("BatteryStatus", {
  status: () =>
    ipcRenderer.invoke("status").then((result) => {
      return result;
    }),
});
