import admin from 'firebase-admin';
import { env } from '../config/env.js';

function getFirebase() {
  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) return null;
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
  }
  return admin.messaging();
}

export async function sendTopicNotification(topic, payload) {
  const messaging = getFirebase();
  if (!messaging) return { skipped: true };
  return messaging.send({ topic, notification: { title: payload.title, body: payload.body }, data: payload.data || {} });
}
