// ─── CampaignSelect — main entry point ───────────────────────────────────────
import { useState } from "react";
import { LoginScreen, UnauthorisedScreen } from "./components/LoginScreen";
import { VotingPage } from "./components/VotingPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { detectInitialScreen, pushUrl } from "./auth";
import { PLAYER_TOKENS, ADMIN_ID } from "./data";
import type { ScreenState } from "./types";

export function CampaignSelect() {
  const [screen, setScreen] = useState<ScreenState>(() => detectInitialScreen());

  function goToPlayer(playerId: string) {
    pushUrl({ player: playerId, t: PLAYER_TOKENS[playerId] });
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
