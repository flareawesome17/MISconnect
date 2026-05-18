#!/usr/bin/env node

/**
 * Cleanup Script - Delete all custom roles from Firestore
 * 
 * Usage: node scripts/cleanup-roles.js
 * 
 * This script will:
 * 1. Connect to Firebase
 * 2. Load all custom roles from the 'roles' collection
 * 3. Delete each custom role
 * 4. Display results
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error('❌ Error: Could not find firebase-service-account.json');
  console.error('Please ensure the Firebase service account key is in the project root.');
  process.exit(1);
}

const db = admin.firestore();
const ROLES_COLLECTION = 'roles';

async function cleanupRoles() {
  try {
    console.log('🧹 Starting cleanup of custom roles...\n');

    // Get all roles
    const snapshot = await db.collection(ROLES_COLLECTION).get();
    
    if (snapshot.empty) {
      console.log('✅ No custom roles found. Database is clean!');
      process.exit(0);
    }

    const roles = [];
    snapshot.forEach((doc) => {
      roles.push({
        id: doc.id,
        name: doc.data().name,
      });
    });

    console.log(`Found ${roles.length} custom role(s) to delete:\n`);
    roles.forEach((role, index) => {
      console.log(`  ${index + 1}. ${role.name} (ID: ${role.id})`);
    });
    console.log();

    // Delete all roles
    console.log('🗑️  Deleting roles...\n');
    let deleted = 0;
    let failed = 0;

    for (const role of roles) {
      try {
        await db.collection(ROLES_COLLECTION).doc(role.id).delete();
        console.log(`  ✅ Deleted: ${role.name}`);
        deleted++;
      } catch (error) {
        console.error(`  ❌ Failed to delete: ${role.name}`);
        console.error(`     Error: ${error.message}`);
        failed++;
      }
    }

    console.log(`\n📊 Results:`);
    console.log(`  ✅ Deleted: ${deleted}`);
    if (failed > 0) {
      console.log(`  ❌ Failed: ${failed}`);
    }
    console.log(`\n✨ Cleanup complete!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run cleanup
cleanupRoles();

