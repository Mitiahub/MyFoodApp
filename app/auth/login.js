import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router'; // ✅ Utiliser expo-router pour la navigation
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ Stockage local
import { auth, getFCMToken } from '../../firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // ✅ Utiliser `useRouter` pour la navigation

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

      // ✅ Stocker les informations utilisateur avec AsyncStorage
      await AsyncStorage.setItem('uid', uid);
      await AsyncStorage.setItem('token', token);
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }

      Alert.alert('Connexion réussie');

      // ✅ Rediriger l'utilisateur vers la page des commandes après connexion
      router.replace('/accueil');


    } catch (error) {
      console.error('❌ Erreur de connexion:', error.message);
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>🔐 Connexion</Text>
      
      <TextInput 
        placeholder="Email" 
        onChangeText={setEmail} 
        value={email} 
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      <TextInput 
        placeholder="Mot de passe" 
        secureTextEntry 
        onChangeText={setPassword} 
        value={password}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      <Button title="Se connecter" onPress={handleLogin} color="#007bff" />
    </View>
  );
}
