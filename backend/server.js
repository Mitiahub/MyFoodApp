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
app.use('/images', express.static(path.join(__dirname, 'public/images')));
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

// ✅ Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur Node.js en cours d'exécution sur http://localhost:${PORT}`);
});
