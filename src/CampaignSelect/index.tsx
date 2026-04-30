// ─── CampaignSelect — main entry point ───────────────────────────────────────
import { useState, useEffect } from "react";
import { LoginScreen, UnauthorisedScreen } from "./components/LoginScreen";
import { VotingPage } from "./components/VotingPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { detectInitialScreen, signInWithMagicToken, signOutPlayer } from "./auth";
import { ADMIN_ID } from "./data";
import type { ScreenState } from "./types";

export function CampaignSelect() {
  const [screen, setScreen] = useState<ScreenState>(() => detectInitialScreen());

  useEffect(() => {
    if (screen.view !== "loading" || !screen.playerId) return;
    const token = new URLSearchParams(window.location.search).get("t") ?? "";
    signInWithMagicToken(screen.playerId, token).then((valid) => {
      if (!valid) { setScreen({ view: "unauth" }); return; }
      if (screen.playerId === ADMIN_ID) {
        setScreen({ view: "admin" });
      } else {
        setScreen({ view: "vote", playerId: screen.playerId });
      }
    });
  }, [screen.view]);

  function goToMain() {
    signOutPlayer().then(() => {
      window.location.replace(window.location.pathname);
    });
  }

  const { view, playerId } = screen;

  if (view === "loading") {
    return null;
  }
  if (view === "admin") {
    return <AdminDashboard onBack={goToMain} />;
  }
  if (view === "vote" && playerId) {
    return <VotingPage playerId={playerId} onBack={goToMain} />;
  }
  if (view === "unauth") {
    return <UnauthorisedScreen onBack={goToMain} />;
  }
  return <LoginScreen />;
}
