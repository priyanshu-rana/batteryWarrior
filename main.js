const { app, BrowserWindow, ipcMain, contextBridge } = require("electron");
const url = require("url");
const path = require("path");
const exec = require("child_process").exec;
const os = require("os");
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

  // mainWindow.webContents.openDevTools();

  // const startUrl = url.format({
  //   pathname: path.join(__dirname, "./app/build/index.html"),
  //   protocol: "file",
  // });
  // const startUrl = "http://localhost:3000";
  // mainWindow.loadURL(startUrl);

  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
  ipcMain.handle("status", fetchSystemInfo);
  createMainWindow();

  // Electron Specific **Imp
  // createMainWindow();
  // const checkBatteryStatus = async () => {
  //   try {
  //     const status = await bateryStatus();
  //     mainWindow.webContents.send("battery-status-update", status);
  //   } catch (error) {
  //     console.error("Failed to get battery status:", error);
  //   }
  // };
  // checkBatteryStatus(); // Initial check
  // setInterval(checkBatteryStatus, 5000); // Check every 5 seconds

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
