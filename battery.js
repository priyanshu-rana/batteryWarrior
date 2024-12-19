const { exec } = require("child_process");
const os = require("os");

function getBatteryStatus() {
  return new Promise((resolve, reject) => {
    let command;
    if (os.platform() === "win32") {
      command = `powershell -Command "Get-WmiObject -Namespace 'root\\cimv2' -Class Win32_Battery | Select-Object -Property BatteryStatus, EstimatedChargeRemaining, BatteryLifePercent, DesignCapacity, FullChargeCapacity, BatteryChemistry, ChargingIndicator, EstimatedRunTime, BatteryRechargeTime, ExpectedLife, ExpectedBatteryLife, DeviceID"`;
    } else if (os.platform() === "linux") {
      command = "upower -i `upower -e | grep 'BAT'`";
    } else if (os.platform() === "darwin") {
      command = "pmset -g batt";
    } else {
      reject("Unsupported platform");
      return;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Execution error: ${error.message}`);
      } else if (stderr) {
        reject(`Command error: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

function getDeviceInfo() {
  return new Promise((resolve, reject) => {
    let command;
    if (os.platform() === "win32") {
      command = `powershell -Command "Get-WmiObject -Class Win32_ComputerSystem | Select-Object -Property Name, Manufacturer, Model, TotalPhysicalMemory"`;
    } else if (os.platform() === "linux") {
      command = `hostnamectl`;
    } else if (os.platform() === "darwin") {
      command = `system_profiler SPHardwareDataType`;
    } else {
      reject("Unsupported platform");
      return;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Execution error: ${error.message}`);
      } else if (stderr) {
        reject(`Command error: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

module.exports = { getBatteryStatus, getDeviceInfo };
