// /js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Firebase Config (SEU PROJETO)
const firebaseConfig = {
  apiKey: "AIzaSyCQxeGDzDRFVmZU1_9pE1KsUeh0KqbdkwA",
  authDomain: "lojavirtual-mjsports.firebaseapp.com",
  projectId: "lojavirtual-mjsports",
  storageBucket: "lojavirtual-mjsports.appspot.com",
  messagingSenderId: "526937577254",
  appId: "1:526937577254:web:c26fbb6b76776928ad53e7"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exporta módulos para uso em todo o sistema
export {
  app,
  auth,
  db,
  storage,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  ref,
  uploadBytes,
  getDownloadURL,
};
