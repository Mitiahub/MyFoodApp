import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';
import { auth, getFCMToken, saveTokenToFirestore } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        console.log("🔑 Utilisateur connecté :", firebaseUser.uid);

        // Récupérer et stocker le token FCM
        const token = await getFCMToken();
        if (token) {
          console.log("📲 Token FCM :", token);
          await saveTokenToFirestore(firebaseUser.uid, token);
        }

        // Redirection vers l'accueil
        router.replace('/home');
      } else {
        console.log("❌ Aucun utilisateur connecté.");
        router.replace('/login');
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    // Gestion des notifications entrantes
    Notifications.addNotificationReceivedListener(notification => {
      console.log("📩 Notification reçue :", notification);
    });

    Notifications.addNotificationResponseReceivedListener(response => {
      console.log("📨 Réponse à la notification :", response);
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🍽 My Food App</Text>
      {user ? <Text>Bienvenue, {user.email} 👋</Text> : <Text>Veuillez vous connecter.</Text>}
    </View>
  );
}
