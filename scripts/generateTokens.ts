// ─── scripts/generateTokens.ts ────────────────────────────────────────────────
// Run once to generate player tokens (including the admin/brisbe token) and
// write them to Firebase. Then send each person their own link.
//
// Usage:
//   npx tsx scripts/generateTokens.ts
//
// To regenerate all tokens (invalidates existing links):
//   npx tsx scripts/generateTokens.ts --force

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

const firebaseConfig = {
  databaseURL: process.env.FIREBASE_DATABASE_URL
    ?? "https://brisgames-3cc42-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// Update BASE_URL to your production URL when deployed.
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

// brisbe is the admin identity — their link opens the admin dashboard.
const PLAYER_IDS = ["tritt", "vvolf", "klsanchez", "panvitae", "brisbe"];

function randomToken(length = 6): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789"; // no ambiguous chars (0/O, 1/l)
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function main() {
  const existing = await get(ref(db, "campaignTokens"));

  if (existing.exists() && !process.argv.includes("--force")) {
    console.log("⚠️  Tokens already exist in Firebase.");
    console.log("   Pass --force to regenerate (this invalidates all existing player links).\n");
    console.log("Existing links:");
    const data = existing.val() as Record<string, string>;
    for (const [pid, tok] of Object.entries(data)) {
      const label = pid === "brisbe" ? `${pid} (admin)` : pid;
      console.log(`   ${label.padEnd(18)} ${BASE_URL}?player=${pid}&t=${tok}`);
    }
    process.exit(0);
  }

  const tokens: Record<string, string> = {};
  for (const pid of PLAYER_IDS) {
    tokens[pid] = randomToken();
  }

  await set(ref(db, "campaignTokens"), tokens);
  console.log("✓ Tokens written to Firebase at campaignTokens/\n");

  console.log("Links — send each person their own link:\n");
  for (const [pid, tok] of Object.entries(tokens)) {
    const label = pid === "brisbe" ? `${pid} (admin)` : pid;
    console.log(`  ${label.padEnd(18)} ${BASE_URL}?player=${pid}&t=${tok}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
