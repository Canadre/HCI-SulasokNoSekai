// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBL8xFH4nJ-jOvgtxQux7VuaIyMGMVptVI",  // mula sa Project settings
  authDomain: "recipeapp-81cab.firebaseapp.com",
  projectId: "recipeapp-81cab", // ito yung hinahanap mo
  storageBucket: "recipeapp-81cab.appspot.com",
  messagingSenderId: "95568561199",
  appId: "1:95568561199:web:XXXXXXXXXXXX", // depende sa Web app na ginawa mo
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
