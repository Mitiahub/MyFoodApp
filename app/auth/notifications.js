import { useEffect, useState } from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getFCMToken } from '../../firebaseConfig';

// 🔥 Configuration des handlers de notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('🔴 Autorisation refusée', 'Veuillez activer les notifications dans les paramètres.');
    return;
  }

  // ✅ Obtenir le token Firebase Cloud Messaging (FCM)
  try {
    const token = await getFCMToken();
    console.log('🔔 Token de notification Firebase:', token);
    return token;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du token:', error);
  }
}

export default function NotificationsScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    // 🎯 Écouteur pour notifications reçues lorsque l'app est ouverte
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('📩 Notification reçue:', notification);
    });

    // 🎯 Écouteur pour les réponses aux notifications (clic utilisateur)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('📨 Réponse à la notification:', response);
      Alert.alert('🔔 Notification', 'Vous avez cliqué sur une notification.');
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>📲 Notifications Push</Text>
      <Text style={{ marginTop: 10, color: '#555' }}>Expo Token: {expoPushToken || 'En attente...'}</Text>
    </View>
  );
}
