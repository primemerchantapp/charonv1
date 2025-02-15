import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDtNedkJo6ikNneZZdrheiWbE3Dn2B8kwQ",
  authDomain: "ces-project-f8b4e.firebaseapp.com",
  databaseURL: "https://ces-project-f8b4e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ces-project-f8b4e",
  storageBucket: "ces-project-f8b4e.firebasestorage.app",
  messagingSenderId: "580767851656",
  appId: "1:580767851656:web:2c852e7edb81a6decdeb3d",
  measurementId: "G-K73DSMWBTP",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

