import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Cast import.meta to any to resolve TS error 'Property env does not exist on type ImportMeta'
const env = (import.meta as any).env;

// Config uses environment variables (Vite standard)
const firebaseConfig = {
  apiKey: "AIzaSyDSJeoNeXeGF8OegC5xp2AHQ2qmUWjq_OE",
  authDomain: "obour-institutes-a607d.firebaseapp.com",
  databaseURL: "https://obour-institutes-a607d-default-rtdb.firebaseio.com",
  projectId: "obour-institutes-a607d",
  storageBucket: "obour-institutes-a607d.firebasestorage.app",
  messagingSenderId: "761134603194",
  appId: "1:761134603194:web:786ca2066f75fae2935b83",
  measurementId: "G-SZYYE5T7P1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;