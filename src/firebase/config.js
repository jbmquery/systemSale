import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4FKEyc1SRVNLlDOPkzkznP14Fp-V6PC0",
  authDomain: "sysminimarket-1dd05.firebaseapp.com",
  projectId: "sysminimarket-1dd05",
  storageBucket: "sysminimarket-1dd05.firebasestorage.app",
  messagingSenderId: "1067722586422",
  appId: "1:1067722586422:web:38516ea7f79891d8f41b97",
};

const app = initializeApp(firebaseConfig);

// 🔥 ESTA LÍNEA FALTABA
export const db = getFirestore(app);

export default app;