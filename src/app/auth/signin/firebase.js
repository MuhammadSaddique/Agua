import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC878ImZRnfG6V3ebSZFvsDLuQLeFNqNAk",
  authDomain: "agua-auth.firebaseapp.com",
  projectId: "agua-auth",
  storageBucket: "agua-auth.firebasestorage.app",
  messagingSenderId: "881000845201",
  appId: "1:881000845201:web:82c2f3543fd8d27a729430"
};

const app = initializeApp(firebaseConfig);
export default app;