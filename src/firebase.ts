import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://brisgames-3cc42-default-rtdb.firebaseio.com",
};

export const db = getDatabase(initializeApp(firebaseConfig));
