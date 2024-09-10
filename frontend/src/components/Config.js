import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDpvVX8x53l8qar9Jo9YKTotkVyvmntepY",
  authDomain: "payclickfeedback.firebaseapp.com",
  projectId: "payclickfeedback",
  storageBucket: "payclickfeedback.appspot.com",
  messagingSenderId: "675378445852",
  appId: "1:675378445852:web:7184af9d3b069f376929d9",
  measurementId: "G-03VD0VTZHB"
};

const app = initializeApp(firebaseConfig);
export  const imageDb = getFirestore(app);