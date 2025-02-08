import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccueilScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const uid = await AsyncStorage.getItem('uid');
        if (!uid) {
          router.replace('/auth/login');
          // ✅ Redirige vers login si non connecté
        } else {
          setUsername(uid); // ✅ Met à jour l'affichage avec l'UID
        }
      } catch (error) {
        console.error('❌ Erreur de récupération des données utilisateur:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/restaurant.jpg')} style={styles.banner} />

      <Text style={styles.title}>Bienvenue dans MyFoodApp 🍽</Text>
      <Text style={styles.subtitle}>
        Bonjour {username ? username : 'utilisateur'}, prêt à commander ?
      </Text>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  banner: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});
