import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, getFCMToken } from '../../firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      console.log('🚀 Tentative de connexion en cours...');

      // 🔥 Authentification avec Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      const uid = user.uid;

      console.log('✅ Connexion réussie !');
      console.log('🆔 UID Firebase:', uid);
      console.log('🔑 Token Firebase:', token);

      // 🔥 Récupérer le token de notification FCM
      const fcmToken = await getFCMToken();
      console.log('📲 Token de notification FCM:', fcmToken);

      // ✅ Stocker les informations utilisateur
      await AsyncStorage.setItem('uid', uid);
      await AsyncStorage.setItem('token', token);
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }

      Alert.alert('Connexion réussie');

      // ✅ Redirection après connexion
      router.replace('/accueil');

    } catch (error) {
      console.error('❌ Erreur de connexion:', error.message);
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/sary.jpg')} // 🔥 Image de fond (à ajouter dans tes assets)
      style={styles.background}
      blurRadius={5} // 🔥 Effet flou pour un design haut de gamme
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>🍽️ Bienvenue sur MyFoodApp</Text>
        <Text style={styles.subtitle}>Connectez-vous pour découvrir nos plats !</Text>

        {/* Champ Email */}
        <TextInput 
          placeholder="Email" 
          onChangeText={setEmail} 
          value={email} 
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#ddd"
        />

        {/* Champ Mot de passe */}
        <TextInput 
          placeholder="Mot de passe" 
          secureTextEntry 
          onChangeText={setPassword} 
          value={password}
          style={styles.input}
          placeholderTextColor="#ddd"
        />

        {/* Bouton de Connexion */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// ✅ Styles premium pour une expérience UI/UX de restaurant haut de gamme
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // 🔥 Fond semi-transparent
    padding: 25,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffcc00', // 🎨 Couleur dorée pour un effet premium
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    marginVertical: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffcc00', // 🔥 Contour doré
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff5733', // 🔥 Rouge vibrant pour inciter à l'action
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
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
});

