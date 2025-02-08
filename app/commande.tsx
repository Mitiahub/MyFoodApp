import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Définition du type Recette
interface Recette {
  id: number;
  nom: string;
  description: string;
  prix: string;
}

export default function CommandeScreen() {
  const router = useRouter();
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://192.168.1.126:5000/api/recettes'; 

  useEffect(() => {
    fetchRecettes();
  }, []);

  const fetchRecettes = async () => {
    try {
      console.log("🌍 Récupération des recettes...");
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: Recette[] = await response.json();
      setRecettes(data);
      console.log("✅ Recettes chargées :", data);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des recettes:', error);
      Alert.alert('Erreur', 'Impossible de charger les recettes.');
    } finally {
      setLoading(false);
    }
  };

  const passerCommande = (recette: Recette) => {
    console.log(`📦 Simulation de la commande pour ${recette.nom}...`);

    setTimeout(() => {
      Alert.alert(
        "Commande Confirmée ✅",
        `Votre commande de ${recette.nom} a été enregistrée avec succès.\n📢 Vous recevrez une notification lorsque votre plat sera prêt.`,
        [{ text: "OK" }]
      );

      AsyncStorage.setItem('last_order', JSON.stringify({ recette, status: "en attente" }))
        .then(() => console.log("✅ Commande stockée localement"))
        .catch((err) => console.error("❌ Erreur lors du stockage de la commande :", err));
      
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Passez Votre Commande</Text>
      <Text style={styles.subtitle}>Choisissez votre plat préféré et commandez en un clic !</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF5733" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={recettes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.recipeCard}>
              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle}>{item.nom}</Text>
                <Text style={styles.recipeDescription}>{item.description}</Text>
                <Text style={styles.recipePrice}>💰 {item.prix} €</Text>
              </View>

              <TouchableOpacity style={styles.button} onPress={() => passerCommande(item)}>
                <Text style={styles.buttonText}>Commander & Payer</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ✅ Ajout des styles harmonisés avec les autres pages
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  recipeCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: '100%',
    alignItems: 'center',
  },
  recipeContent: {
    alignItems: 'center',
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
    textAlign: 'center',
  },
  recipePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5733',
  },
  button: {
    backgroundColor: '#FF5733',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
