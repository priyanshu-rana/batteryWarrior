document.addEventListener("DOMContentLoaded", () => {
  const infoContainer = document.getElementById("info-container");
  const batteryInfoContainer = document.getElementById("battery-info");
  const deviceInfoContainer = document.getElementById("device-info");

  const btnBatteryInfo = document.getElementById("btn-battery-info");
  const btnDeviceInfo = document.getElementById("btn-device-info");

  //TODO : [MID-MAJ] Seperate CMD call for Battery and System Info
  //TODO: [Refactor] Move fn(s) to helpers
  const fetchBatteryNSystemInfo = async () => {
    try {
      const rawStatus = await window.BatteryNSystemInfo.status();
      // console.log("rawStatus:", rawStatus);
      const transformedStatus =
        transformBatteryStatusAndDeviceInfoJSONForLinux(rawStatus);
      // console.log("rawtransformedStatusStatus:", transformedStatus);

      updateInfo(transformedStatus);
    } catch (error) {
      console.error("Error fetching Battery and System status:", error);
      infoContainer.innerHTML = `<p>Error fetching Battery and System information.</p>`;
    }
  };

  const updateInfo = (status) => {
    if (!status) {
      infoContainer.innerHTML = `<p>No information available.</p>`;
      return;
    }

    const batteryInfo = Object.entries(status["battery"]).filter(
      ([key]) => key
    );
    const deviceInfo = Object.entries(status["device"]).filter(([key]) => key);

    if (!batteryInfo) {
      infoContainer.innerHTML = `<p>No Battery information available.</p>`;
      return;
    }
    if (!deviceInfo) {
      infoContainer.innerHTML = `<p>No Device information available.</p>`;
      return;
    }

    // Create HTML for battery information
    const renderbatteryHTML = (batteryInfo) => {
      batteryInfoContainer.innerHTML = `
      <h3>Battery Information</h3>
      <div class="info-grid">
        ${batteryInfo
          .map(
            ([key, value]) => `
          <div class="info-item">
            <strong>${key}</strong>: ${value}
          </div>`
          )
          .join("")}
      </div>
    `;
    };

    // Create HTML for device information
    const renderDeviceHTML = (deviceInfo) => {
      deviceInfoContainer.innerHTML = `
      <h3>Device Information</h3>
      <div class="info-grid">
        ${deviceInfo
          .map(
            ([key, value]) => `
          <div class="info-item">
            <strong>${key}</strong>: ${value}
          </div>`
          )
          .join("")}
      </div>
    `;
    };

    const toggleView = (view) => {
      if (view === "battery") {
        batteryInfoContainer.style.display = "block";
        deviceInfoContainer.style.display = "none";
        btnBatteryInfo.style.backgroundColor = "#D3D3D3";
        btnDeviceInfo.style.backgroundColor = "";
      } else if (view === "device") {
        deviceInfoContainer.style.display = "block";
        batteryInfoContainer.style.display = "none";
        btnDeviceInfo.style.backgroundColor = "#D3D3D3";
        btnBatteryInfo.style.backgroundColor = "";
      }
    };

    btnBatteryInfo.addEventListener("click", () => toggleView("battery"));
    btnDeviceInfo.addEventListener("click", () => toggleView("device"));

    renderbatteryHTML(batteryInfo);
    renderDeviceHTML(deviceInfo);
  };

  fetchBatteryNSystemInfo();
  setInterval(fetchBatteryNSystemInfo, 5000);
});

const transformBatteryStatusJSONForWindows = (status) => {
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
};

// Currently Same as of Windows
const transformBatteryStatusAndDeviceInfoJSONForLinux = (status) => {
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

  return { device: deviceData, battery: batteryData };
};
