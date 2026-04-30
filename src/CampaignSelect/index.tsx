// ─── CampaignSelect — main entry point ───────────────────────────────────────
import { useState, useEffect } from "react";
import { LoginScreen, UnauthorisedScreen } from "./components/LoginScreen";
import { VotingPage } from "./components/VotingPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { detectInitialScreen, pushUrl, validatePlayerFirebase } from "./auth";
import { ADMIN_ID } from "./data";
import type { ScreenState } from "./types";

export function CampaignSelect() {
  const [screen, setScreen] = useState<ScreenState>(() => detectInitialScreen());

  useEffect(() => {
    if (screen.view !== "loading" || !screen.playerId) return;
    const token = new URLSearchParams(window.location.search).get("t") ?? "";
    validatePlayerFirebase(screen.playerId, token).then((valid) => {
      if (!valid) { setScreen({ view: "unauth" }); return; }
      if (screen.playerId === ADMIN_ID) {
        setScreen({ view: "admin" });
      } else {
        setScreen({ view: "vote", playerId: screen.playerId });
      }
    });
  }, [screen.view]);

  function goToPlayer(playerId: string, token: string) {
    pushUrl({ player: playerId, t: token });
    if (playerId === ADMIN_ID) {
      setScreen({ view: "admin" });
    } else {
      setScreen({ view: "vote", playerId });
    }
  }

  function goToLogin() {
    pushUrl({});
    setScreen({ view: "login" });
  }

  const { view, playerId } = screen;

  if (view === "loading") {
    return null;
  }
  if (view === "admin") {
    return <AdminDashboard onBack={goToLogin} />;
  }
  if (view === "vote" && playerId) {
    return <VotingPage playerId={playerId} onBack={goToLogin} />;
  }
  if (view === "unauth") {
    return <UnauthorisedScreen onBack={goToLogin} />;
  }
  return <LoginScreen onOpenPlayer={goToPlayer} />;
}
