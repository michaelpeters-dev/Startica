import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzfnMBGMy-AkTwKIMSt-my8RXHdFkE41k",
  authDomain: "startica-9ab30.firebaseapp.com",
  projectId: "startica-9ab30",
  storageBucket: "startica-9ab30.appspot.com",
  messagingSenderId: "67766575395",
  appId: "1:67766575395:web:7d3f0538177ad9708dec96",
  measurementId: "G-SL72MZS0R1",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export default app;
export { db, storage };
