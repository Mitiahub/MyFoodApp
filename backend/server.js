require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 Configuration PostgreSQL
const pool = new Pool({
  user: 'postgres',  // Remplace par ton utilisateur PostgreSQL
  host: 'localhost', // Serveur PostgreSQL
  database: 'restau', // Nom de ta base de données
  password: 'root',  // Mot de passe PostgreSQL
  port: 5432,        // Port PostgreSQL (5432 par défaut)
});

// ✅ Activer CORS pour autoriser les requêtes depuis React Native
app.use(cors({ origin: '*' }));
app.use(express.json());

// ✅ Route pour récupérer les recettes
app.get('/api/recettes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recette');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des recettes:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/commande/passer', async (req, res) => {
  console.log("📥 Requête reçue :", req.body);

  try {
    const { user_id, recette_id, quantite } = req.body;

    if (!user_id || !recette_id || !quantite) {
      return res.status(400).json({ error: 'Données incomplètes' });
    }

    // 🔥 Insérer la commande directement dans PostgreSQL
    const result = await pool.query(
      `INSERT INTO commande (utilisateur_id, status, montant_total, created_at, updated_at) 
      VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id`,
      [user_id, 'en attente', quantite * 10] // Montant fixe temporaire
    );

    const commandeId = result.rows[0].id;

    // 🔥 Associer la recette commandée
    await pool.query(
      `INSERT INTO commande_recette (commande_id, recette_id, quantite) VALUES ($1, $2, $3)`,
      [commandeId, recette_id, quantite]
    );

    console.log(`✅ Commande ${commandeId} enregistrée avec succès.`);
    res.json({ message: "Commande enregistrée avec succès.", commande_id: commandeId });

  } catch (err) {
    console.error('❌ Erreur lors de l\'enregistrement de la commande :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



// ✅ Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur Node.js en cours d'exécution sur http://localhost:${PORT}`);
});
