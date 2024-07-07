import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { transformBatteryStatusJSON } from "./helpers/helper";

const App: React.FC = () => {
  const [status, setStatus] = useState();
  useEffect(() => {
    if (window.BatteryStatus) {
      window.BatteryStatus.status().then((status: any) => {
        console.log("status:", transformBatteryStatusJSON(status));
        setStatus(status);
      });
    }
  }, []);

  return (
    <div className="App">
      <h1>{status}</h1>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
