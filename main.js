const { app, BrowserWindow, ipcMain, contextBridge } = require("electron");
const url = require("url");
const path = require("path");
const exec = require("child_process").exec;
const os = require("os");
const http = require("http");
const { getBatteryStatus, getDeviceInfo } = require("./battery");

// let mainWindow;
// const bateryStatus = () => {
//   return new Promise((resolve, reject) => {
//     let command;
//     if (os.platform() === "win32") {
//       // command = `powershell -Command "Get-WmiObject -Namespace "root\\cimv2" -Class Win32_Battery | Select-Object -Property BatteryStatus, EstimatedChargeRemaining, BatteryLifePercent, DesignCapacity, FullChargeCapacity, BatteryChemistry, ChargingIndicator, EstimatedRunTime, BatteryRechargeTime, ExpectedLife, ExpectedBatteryLife, DeviceID"`;
//       command = `powershell -Command "Get-WmiObject -Namespace 'root\\cimv2' -Class Win32_Battery | Select-Object -Property BatteryStatus, EstimatedChargeRemaining, BatteryLifePercent, DesignCapacity, FullChargeCapacity, BatteryChemistry, ChargingIndicator, EstimatedRunTime, BatteryRechargeTime, ExpectedLife, ExpectedBatteryLife, DeviceID"`;
//     } else {
//       command = "upower -i `upower -e | grep 'BAT'`";
//     }
//     console.log("command", command);
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error: ${error.message}`);
//         reject(error);
//       }
//       if (stderr) {
//         console.error(`stderr: ${stderr}`);
//         reject(stderr);
//       }
//       resolve(stdout);
//     });
//   });
// };

async function fetchSystemInfo() {
  try {
    const battery = await getBatteryStatus();
    const device = await getDeviceInfo();
    // console.log("Battery Information:", battery);
    // console.log("Device Information:", device);
    return { battery: battery, device: device };
  } catch (error) {
    console.error("Error fetching system info:", error);
  }
}

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

  const startUrl = "http://localhost:3000";
  const indexPath = path.resolve(
    app.getAppPath(),
    "app-bw",
    "build",
    "index.html"
  );

  http
    .get(startUrl, (res) => {
      console.log("Dev server is running on:", startUrl);
      mainWindow.loadURL(startUrl);
    })
    .on("error", (err) => {
      console.log("Dev server is not running. Loading local build:", indexPath);
      mainWindow.loadFile(indexPath);
    });
}

app.whenReady().then(() => {
  ipcMain.handle("status", fetchSystemInfo);
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });
