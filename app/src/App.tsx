import React, { useEffect, useState } from "react";
import "./App.css";
import { transformBatteryStatusJSONForWindows } from "./helpers/helper";
import { WindowsInterface } from "./interfaces/windows";

const App: React.FC = () => {
  const [status, setStatus] = useState<WindowsInterface>();

  const fetchBatteryStatus = async () => {
    try {
      if (window.BatteryStatus.status()) {
        const rawSatus = await window.BatteryStatus.status();
        const transformedStatus =
          transformBatteryStatusJSONForWindows(rawSatus);
        setStatus(transformedStatus);
      }
    } catch (error) {
      console.error("Error fetching battery status:", error);
    }
  };

  useEffect(() => {
    fetchBatteryStatus();

    // Polling mechanism Approach
    const intervalId = setInterval(fetchBatteryStatus, 5000);

    return () => clearInterval(intervalId); //Clearnup interval on component unmount

    // Event-based Approach using Browser API
    // let batteryManager: any = null;
    // const handleBatteryChange = () => {
    //   console.log("Battery status changed.");
    //   fetchBatteryStatus();
    // };

    // const monitorBatteryStatus = async () => {
    //   try {
    //     batteryManager = await navigator.getBattery();
    //     console.log("batteryManager", batteryManager);
    //     batteryManager.addEventListener("chargingchange", handleBatteryChange);
    //     batteryManager.addEventListener("levelchange", handleBatteryChange);
    //   } catch (error) {
    //     console.error("Battery Status API not supported:", error);
    //   }
    // };

    // monitorBatteryStatus();

    // return () => {
    //   if (batteryManager) {
    //     batteryManager.removeEventListener(
    //       "chargingchange",
    //       handleBatteryChange
    //     );
    //     batteryManager.removeEventListener("levelchange", handleBatteryChange);
    //   }
    // };
  }, []);

  // Electron Specific **Imp

  // useEffect(() => {
  //   if (window.BatteryStatus) {
  //     const handleStatusUpdate = (event: any, status: any) => {
  //       setStatus(transformBatteryStatusJSONForWindows(status));
  //     };

  //     window.BatteryStatus.onStatusUpdate(handleStatusUpdate);

  //     // Cleanup listener on component unmount
  //     return () => {
  //       window.BatteryStatus.onStatusUpdate(handleStatusUpdate);
  //     };
  //   }
  // }, []);
  console.log("status", status);

  return (
    <div>
      <h1>Battery Information</h1>
      {status ? (
        <ul>
          <li>
            Battery Status:{" "}
            {status.BatteryStatus === "2" ? "Charging" : "On Battery"}
          </li>
          <li>Estimated Charge Remaining: {status.EstimatedChargeRemaining}</li>
          <li>Battery Life Percent: {status.BatteryLifePercent}</li>
          <li>Design Capacity: {status.DesignCapacity}</li>
          <li>Full Charge Capacity: {status.FullChargeCapacity}</li>
          <li>Battery Chemistry: {status.BatteryChemistry}</li>
          <li>Charging Indicator: {status.ChargingIndicator}</li>
          <li>Estimated Run Time: {status.EstimatedRunTime}</li>
          <li>Battery Recharge Time: {status.BatteryRechargeTime}</li>
          <li>Expected Life: {status.ExpectedLife}</li>
          <li>Expected Battery Life: {status.ExpectedBatteryLife}</li>
          <li>Device ID: {status.DeviceID}</li>
        </ul>
      ) : (
        <p>No battery information available.</p>
      )}
    </div>
  );
};

export default App;
