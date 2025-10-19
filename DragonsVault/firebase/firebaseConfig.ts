import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBds-1ityhHbVdZXAn3RLr8Gha9tXR7HVY",
  authDomain: "dragonsvault-4173d.firebaseapp.com",
  projectId: "dragonsvault-4173d",
  storageBucket: "dragonsvault-4173d.appspot.com", 
  messagingSenderId: "319217808303",
  appId: "1:319217808303:web:67d2c6c6e299728412f55a",
  measurementId: "G-1M1RB72QHV", 
};

const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);