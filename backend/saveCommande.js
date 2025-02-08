const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',  // ⚠️ Remplace avec ton utilisateur PostgreSQL
  host: 'localhost', // ⚠️ Mets ton IP si besoin
  database: 'restau', // ⚠️ Nom de ta base de données
  password: 'root',  // ⚠️ Mets ton mot de passe PostgreSQL
  port: 5432,        // ⚠️ Port PostgreSQL (5432 par défaut)
});

async function enregistrerCommande(user_id, recette_id, quantite) {
  try {
    console.log(`📦 Enregistrement de la commande : Utilisateur ${user_id}, Recette ${recette_id}, Quantité ${quantite}...`);

    // 🔥 Insertion de la commande
    const commandeResult = await pool.query(
      `INSERT INTO commande (utilisateur_id, status, montant_total, created_at, updated_at) 
      VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id`,
      [user_id, 'en attente', quantite * 10] // Prix temporaire
    );

    const commandeId = commandeResult.rows[0].id;

    // 🔥 Associer la recette commandée
    await pool.query(
      `INSERT INTO commande_recette (commande_id, recette_id, quantite) VALUES ($1, $2, $3)`,
      [commandeId, recette_id, quantite]
    );

    console.log(`✅ Commande ${commandeId} enregistrée avec succès.`);
    return { success: true, commandeId };

  } catch (err) {
    console.error('❌ Erreur lors de l\'enregistrement de la commande :', err);
    return { success: false, error: err.message };
  }
}

// ✅ Test manuel
enregistrerCommande(1, 3, 2).then(console.log);
