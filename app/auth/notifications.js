import { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>📲 Notifications Push</Text>
      <Text style={styles.subtitle}>Recevez les dernières mises à jour en temps réel.</Text>
      
      <View style={styles.tokenContainer}>
        <Text style={styles.tokenLabel}>Expo Token :</Text>
        <Text style={styles.tokenText}>{expoPushToken || '🔄 En attente...'}</Text>
      </View>
    </View>
  );
}

// ✅ Ajout des styles premium UI/UX
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e1', // 🍽️ Fond plus doux
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  tokenContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '90%',
    alignItems: 'center',
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b4513',
  },
  tokenText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
  },
});
