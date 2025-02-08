const admin = require("firebase-admin");

// 📌 Charger le fichier JSON du compte de service
const serviceAccount = require("./service-account.json"); // Assurez-vous du bon chemin

// ✅ Initialiser Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ✅ Fonction pour envoyer une notification via Firebase Cloud Messaging
async function sendNotification() {
  const fcmToken = "cQT366drSCWBU35qqGwkIn:APA91bGjQcPY_39VM37fEyvUmIVIDCh4tbLlVrSTjVl4BeAwso8QPPkdIVgcr1usHA-5NRtGJSaG09jyElyiw7pak-XJ_aiizNH8lFwTwQPg-0bIRFxnpXhKi1PrrbhTCzcLmA1UkQ6-"; // 🔥 Ton token FCM

  const message = {
    token: fcmToken,
    notification: {
      title: "🚀 Test de Notification FCM",
      body: "Ceci est un test de notification via Firebase Cloud Messaging.",
    },
    data: {
      click_action: "FLUTTER_NOTIFICATION_CLICK",
      type: "test",
    },
  };

  try {
    console.log("📡 Envoi de la notification à Firebase...");
    const response = await admin.messaging().send(message);
    console.log("✅ Notification envoyée avec succès :", response);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de la notification :", error);
  }
}

// 📌 Exécuter l'envoi de la notification
sendNotification();
