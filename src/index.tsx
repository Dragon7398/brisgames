import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CampaignSelect } from "./CampaignSelect";

function isCampaignRoute(): boolean {
  try {
    const p = new URLSearchParams(window.location.search);
    return p.has("player") || p.has("t");
  } catch {
    return false;
  }
}

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    {isCampaignRoute()
      ? <div className="campaign-section"><CampaignSelect /></div>
      : <App />
    }
  </React.StrictMode>
);
