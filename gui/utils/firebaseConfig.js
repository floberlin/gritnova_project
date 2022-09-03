import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
 
// Initialize Firebase
const app = initializeApp ({
    apiKey: "AIzaSyD26mZ2rGyae16s9RkKH1ovwvilJ7hJO1w",
    authDomain: "bountyscape-b7f21.firebaseapp.com",
    projectId: "bountyscape-b7f21",
    storageBucket: "bountyscape-b7f21.appspot.com",
    messagingSenderId: "774597285057",
    appId: "1:774597285057:web:3025aeb2ede9b929a0f040"
});
 
// Firebase storage reference
const storage = getStorage(app);
export default storage;