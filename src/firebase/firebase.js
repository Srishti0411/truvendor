
// Import Firebase services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDjVXp-GTpdoGVhOb4vhaR3BNSSjrkUTSY",
  authDomain: "trustify-feb1b.firebaseapp.com",
  projectId: "trustify-feb1b",
  storageBucket: "trustify-feb1b.appspot.com",
  messagingSenderId: "1044274572349",
  appId: "1:1044274572349:web:f058ca6f361a002d458e54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
