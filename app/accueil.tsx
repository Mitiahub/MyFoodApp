import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function AccueilScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 🏡 Image d'accueil */}
      <Image source={require('@/assets/images/restaurant.jpg')} style={styles.banner} />

      {/* 🎉 Message de bienvenue */}
      <Text style={styles.subtitle}>
        Découvrez nos plats délicieux et commandez en quelques clics. Profitez d'une expérience culinaire unique !
      </Text>

      {/* 📌 Bouton pour voir les recettes */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/commande')}>
        <Text style={styles.buttonText}>🍽 Voir les Recettes</Text>
      </TouchableOpacity>

      {/* 📌 Bouton pour aller aux commandes */}
      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/commande')}>
        <Text style={styles.secondaryButtonText}>📦 Voir mes Commandes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e1', // 🎨 Fond chaleureux
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
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
