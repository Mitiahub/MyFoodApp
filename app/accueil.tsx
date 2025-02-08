import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
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
        } else {
          setUsername(uid);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des données utilisateur:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🏡 Image d'accueil */}
      <Image source={require('@/assets/images/plat.jpg')} style={styles.banner} />

      {/* 🎉 Message de bienvenue personnalisé */}
      <Text style={styles.title}>🍽 Bienvenue, {username ? username : 'Cher Client'} !</Text>
      <Text style={styles.subtitle}>
        Nous sommes ravis de vous accueillir dans **MyFoodApp**. Découvrez nos plats exquis et profitez d'une
        expérience culinaire unique ! 
      </Text>

      {/* 📌 Bouton pour voir les recettes */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/Recettes')}>
        <Text style={styles.buttonText}>🍽 Voir le Menu</Text>
      </TouchableOpacity>

      {/* 📌 Bouton pour aller aux commandes */}
      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/commande')}>
        <Text style={styles.secondaryButtonText}>📦 Voir mes Commandes</Text>
      </TouchableOpacity>
    </View>
  );
}

// ✅ Style UI/UX Premium
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e1', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  banner: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: 15,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 15,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
