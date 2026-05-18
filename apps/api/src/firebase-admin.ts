import "server-only";
import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const requiredEnv = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
] as const;

function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  for (const key of requiredEnv) {
    if (!process.env[key]) {
      throw new Error(`Missing Firebase admin environment variable: ${key}`);
    }
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export function adminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function adminDb() {
  return getFirestore(getFirebaseAdminApp());
}
