import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

// ✅ Définition du type Recette
interface Recette {
  id: number;
  nom: string;
  description: string;
  prix: string;
}

export default function WelcomeScreen() {
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
    Alert.alert(
      "Commande Confirmée ✅",
      `Vous avez commandé : ${recette.nom}\n💰 Prix : ${recette.prix} €`,
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Découvrez nos plats délicieux et commandez en quelques clics.</Text>

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
                <Text style={styles.buttonText}>Commander</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.viewOrdersButton} onPress={() => router.push('/commande')}>
        <Text style={styles.buttonText}>Voir mes commandes ➜</Text>
      </TouchableOpacity>
    </View>
  );
}

// ✅ Ajout des styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    padding: 20,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewOrdersButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
});
