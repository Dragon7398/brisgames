import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp({
  databaseURL: "https://brisgames-3cc42-default-rtdb.firebaseio.com",
});

const ADMIN_ID = "brisbe";

/**
 * Validates a magic-link token against the stored value in campaignTokens and,
 * if valid, returns a Firebase Auth custom token with playerId/isAdmin claims.
 * The client then calls signInWithCustomToken so that all subsequent Realtime
 * Database requests carry those claims and are enforced by database.rules.json.
 */
export const mintAuthToken = functions.https.onCall(async (data: unknown) => {
  const { playerId, token } = (data ?? {}) as { playerId?: unknown; token?: unknown };

  if (typeof playerId !== "string" || typeof token !== "string" || !playerId || !token) {
    throw new functions.https.HttpsError("invalid-argument", "playerId and token are required");
  }

  const snap = await admin.database().ref(`campaignTokens/${playerId}`).get();
  if (!snap.exists() || snap.val() !== token) {
    throw new functions.https.HttpsError("unauthenticated", "Invalid token");
  }

  const customToken = await admin.auth().createCustomToken(playerId, {
    playerId,
    isAdmin: playerId === ADMIN_ID,
  });

  return { customToken };
});
