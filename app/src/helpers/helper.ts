export const transformBatteryStatusJSONForWindows = (status: string) => {
  const batteryData: any = {};
  status.split("\n").forEach((line) => {
    const parts = line.split(":");
    if (parts.length === 2) {
      const key = parts[0].trim();
      const value = parts[1].trim();
      batteryData[key] = value;
    }
  });
  return batteryData;
};
