require("dotenv").config();
  const { initializeApp } =require("firebase/app");
const { getAuth} = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyBkqzyZGASrTROj1uPl69EZJfhG1QDAXOI",
  authDomain: "trans-serenity-367020.firebaseapp.com",
  projectId: "trans-serenity-367020",
  storageBucket: "trans-serenity-367020.appspot.com",
  messagingSenderId: "28291341601",
  appId: "1:28291341601:web:df227ea3c893ff29f97260"
};

const app = initializeApp(firebaseConfig);
const auth= getAuth(app);

module.exports = {
  auth
};
