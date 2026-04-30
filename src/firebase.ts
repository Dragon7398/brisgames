/// <reference types="node" />
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey:      process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:  "brisgames-3cc42.firebaseapp.com",
  databaseURL: "https://brisgames-3cc42-default-rtdb.firebaseio.com",
  projectId:   "brisgames-3cc42",
};

const app = initializeApp(firebaseConfig);

export const db        = getDatabase(app);
export const auth      = getAuth(app);
export const functions = getFunctions(app);
