/*** 
 *  
 * Description: Firebase app setup
 * Issues: -
 * 
 * Last revision: Nikola Lukic, 03-Jan-2024
 * 
***/


import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore" // Currently not in use
import { getStorage } from "firebase/storage"
import { getDatabase } from "firebase/database"
import firebaseConfig from "./firebase.config"

const firebaseCFG = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  databaseURL: firebaseConfig.databaseURL,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
}

initializeApp(firebaseCFG)
export const auth = getAuth()
export const database = getDatabase()
export const storage = getStorage()