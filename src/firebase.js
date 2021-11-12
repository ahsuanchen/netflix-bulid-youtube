import firebase from "firebase/firebase-compat";

const firebaseConfig = {
  apiKey: "AIzaSyCV12pTPbogbUc4meGiZygTaZEjVfxWKnw",
  authDomain: "netflix-clone-1fc1b.firebaseapp.com",
  projectId: "netflix-clone-1fc1b",
  storageBucket: "netflix-clone-1fc1b.appspot.com",
  messagingSenderId: "640968829821",
  appId: "1:640968829821:web:e76268d37d00873eda7a14",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth };
export default db;
