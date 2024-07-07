const { app, BrowserWindow, ipcMain, contextBridge } = require("electron");
const url = require("url");
const path = require("path");
const exec = require("child_process").exec;

const bateryStatus = () => {
  return new Promise((resolve, reject) => {
    exec("upower -i `upower -e | grep 'BAT'`", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "batteryWarrior",
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.webContents.openDevTools();

  // const startUrl = url.format({
  //   pathname: path.join(__dirname, "./app/build/index.html"),
  //   protocol: "file",
  // });
  const startUrl = "http://localhost:3000";

  mainWindow.loadURL(startUrl);
}

app.whenReady().then(() => {
  ipcMain.handle("status", () => {
    return bateryStatus();
  });
  createMainWindow();
});
