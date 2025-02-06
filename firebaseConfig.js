import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// ✅ Configuration Firebase corrigée (storageBucket mis à jour)
const firebaseConfig = {
  apiKey: "AIzaSyAbL05J7L4svnBWVM8dAQZRspoHiNbTPK0",
  authDomain: "test-11714.firebaseapp.com",
  projectId: "test-11714",
  storageBucket: "test-11714.appspot.com",  // ✅ Correction ici
  messagingSenderId: "8499144123",
  appId: "1:8499144123:android:f315d6fd9084c78a57d09e"
};

// ✅ Initialiser Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialiser Auth et Firestore
export const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Fonction pour récupérer le token FCM (🔄 Correction ici)
export async function getFCMToken() {
  if (!Device.isDevice) {
    console.warn("❌ Les notifications push ne fonctionnent que sur un appareil réel.");
    return null;
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      console.warn("❌ Permission de notification refusée.");
      return null;
    }
  }

  // ✅ Utilisation de `getDevicePushTokenAsync()` pour récupérer un vrai token FCM
  const { data: token } = await Notifications.getDevicePushTokenAsync();
  console.log("📲 Token Firebase Cloud Messaging (FCM) :", token);
  return token;
}

// ✅ Sauvegarde du token FCM dans Firestore
export async function saveTokenToFirestore(userUid, token) {
  if (!userUid || !token) return;

  const userRef = doc(db, "users", userUid);
  await setDoc(userRef, { fcmToken: token }, { merge: true });
  console.log("✅ Token FCM sauvegardé pour UID:", userUid);
}
