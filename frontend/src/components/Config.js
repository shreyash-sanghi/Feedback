import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAEiOopbsqguOU1dh2msz6CYk6bRGMFy9w",
  authDomain: "sufal-d8a4c.firebaseapp.com",
  projectId: "sufal-d8a4c",
  storageBucket: "sufal-d8a4c.appspot.com",
  messagingSenderId: "460921888630",
  appId: "1:460921888630:web:5bd9775b9626f3981fe457"
};

const app = initializeApp(firebaseConfig);
export  const imageDb = getFirestore(app);