//src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCiq7Hg5uPmQt4q7tkAViTThyiUnrax0Eg",
  authDomain: "sysmarket-b18a6.firebaseapp.com",
  projectId: "sysmarket-b18a6",
  storageBucket: "sysmarket-b18a6.firebasestorage.app",
  messagingSenderId: "99541041256",
  appId: "1:99541041256:web:130113b01ad70057747bdd",
  measurementId: "G-KH8LDJHZE9"
};

const app = initializeApp(firebaseConfig);

// 🔥 ESTA LÍNEA FALTABA
export const db = getFirestore(app);

export const storage = getStorage(app);

export const auth = getAuth(app);

export default app;