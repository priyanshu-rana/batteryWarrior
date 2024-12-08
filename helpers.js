//TODO: helper fn(s) are not implemented yet

function transformBatteryStatusJSONForWindows(status) {
  const batteryData = {};
  status.split("\n").forEach((line) => {
    const parts = line.split(":");
    if (parts.length === 2) {
      const key = parts[0].trim();
      const value = parts[1].trim();
      batteryData[key] = value;
    }
  });
  return batteryData;
}

function transformBatteryStatusAndDeviceInfoJSONForLinux(status) {
  const batteryData = {};
  const deviceData = {};
  status["battery"].split("\n").forEach((line) => {
    const parts = line.split(":");
    if (parts.length === 2) {
      const key = parts[0].trim();
      const value = parts[1].trim();
      batteryData[key] = value;
    }
  });
  status["device"].split("\n").forEach((line) => {
    const parts = line.split(":");
    if (parts.length === 2) {
      const key = parts[0].trim();
      const value = parts[1].trim();
      deviceData[key] = value;
    }
  });

  return { ...deviceData, ...batteryData };
}

module.exports = {
  transformBatteryStatusAndDeviceInfoJSONForLinux,
  transformBatteryStatusJSONForWindows,
};
