import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';

export default function RecettesScreen() {
  const [recettes, setRecettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://192.168.1.126:5000/api/recettes'; // ✅ Remplace par l'IP correcte

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

      const data = await response.json();
      setRecettes(data);
      console.log("✅ Recettes chargées :", data);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des recettes:', error);
      Alert.alert('Erreur', 'Impossible de charger les recettes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>👨‍🍳 Nos Recettes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF5733" style={{ marginTop: 20 }} />
      ) : recettes.length === 0 ? (
        <Text style={styles.errorText}>❌ Aucune recette disponible</Text> // ✅ Affiche un message si la liste est vide
      ) : (
        <FlatList
          data={recettes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.recipeCard}>
              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle}>{item.nom}</Text>
                <Text style={styles.recipeDescription}>{item.description}</Text>
                <Text style={styles.recipePrice}>💰 {item.prix} €</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e1', // 🍽️ Fond plus visible
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 20,
    color: '#8b4513', // ✅ Assure que le texte est visible
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
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
    width: '95%', // ✅ Corrige la largeur des cartes
  },
  recipeContent: {
    padding: 10,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // ✅ Assure que le texte est lisible
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
});
