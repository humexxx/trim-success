/**
 * Idempotent seed script: creates a demo + admin Firebase Auth user in
 * the production "trim-success" project, sets the admin custom claim,
 * and upserts matching Firestore `/users/{uid}` profile docs so the
 * admin impersonation picker can list them.
 *
 * Usage (uses gcloud Application Default Credentials by default):
 *   npx tsx scripts/seed-demo-accounts.ts
 *
 * Or with an explicit service account JSON:
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa.json \
 *     npx tsx scripts/seed-demo-accounts.ts
 *
 * What it does (all are no-ops if state already matches):
 *   1. Creates demo@trim-success.test (or updates the password).
 *   2. Creates admin@trim-success.test (or updates the password).
 *   3. Sets {admin: true} custom claim on the admin user.
 *   4. Upserts /users/{uid} Firestore docs with name + description so
 *      the impersonation picker has metadata to render.
 *
 * What it does NOT do:
 *   - Seed any cube data, drivers, or settings.
 *   - Charge anything beyond the Firebase Auth free tier (50k MAU).
 *
 * If you want to wipe these users, delete them in Firebase Console
 * → Authentication AND Firestore /users, then re-run.
 */

import admin from "firebase-admin";

interface SeedUser {
  email: string;
  password: string;
  displayName: string;
  description: string;
  isAdmin: boolean;
}

const USERS: SeedUser[] = [
  {
    email: "demo@trim-success.test",
    password: "Demo1234!",
    displayName: "Demo User",
    description:
      "Cuenta de demostración sin privilegios. Úsala para probar el flujo de un usuario regular.",
    isAdmin: false,
  },
  {
    email: "admin@trim-success.test",
    password: "Admin1234!",
    displayName: "Admin User",
    description:
      "Cuenta administradora. Acceso a impersonación y herramientas internas.",
    isAdmin: true,
  },
];

async function getOrCreateUser(user: SeedUser) {
  try {
    const existing = await admin.auth().getUserByEmail(user.email);
    console.log(`  ↻ Updating existing user ${user.email} (uid=${existing.uid})`);
    await admin.auth().updateUser(existing.uid, {
      password: user.password,
      displayName: user.displayName,
      emailVerified: true,
    });
    return existing.uid;
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code !== "auth/user-not-found") {
      throw err;
    }
    console.log(`  + Creating new user ${user.email}`);
    const created = await admin.auth().createUser({
      email: user.email,
      password: user.password,
      displayName: user.displayName,
      emailVerified: true,
    });
    return created.uid;
  }
}

async function setAdminClaim(uid: string, isAdmin: boolean) {
  const userRecord = await admin.auth().getUser(uid);
  const currentClaim = (userRecord.customClaims ?? {}) as Record<string, unknown>;
  const desiredClaim = { ...currentClaim, admin: isAdmin };

  if (currentClaim.admin === isAdmin) {
    console.log(`  · admin claim already = ${isAdmin}, no change`);
    return;
  }

  await admin.auth().setCustomUserClaims(uid, desiredClaim);
  console.log(`  ✓ Set admin claim to ${isAdmin}`);
}

/**
 * Upsert the Firestore profile doc the impersonation picker reads.
 * `createdAt` is only written on insert so re-running this script
 * doesn't keep bumping the "Creado <date>" the picker shows.
 */
async function upsertUserDoc(uid: string, user: SeedUser) {
  const db = admin.firestore();
  const ref = db.collection("users").doc(uid);
  const existing = await ref.get();

  const data: Record<string, unknown> = {
    uid,
    email: user.email,
    name: user.displayName,
    description: user.description,
  };

  if (!existing.exists) {
    data.createdAt = new Date().toISOString();
    await ref.set(data);
    console.log(`  + Created Firestore /users/${uid}`);
  } else {
    await ref.set(data, { merge: true });
    console.log(`  ↻ Updated Firestore /users/${uid}`);
  }
}

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID ?? "trim-success";

async function main() {
  // applicationDefault() honors GOOGLE_APPLICATION_CREDENTIALS first
  // and falls back to ~/.config/gcloud/application_default_credentials.json
  // (created by `gcloud auth application-default login`).
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: PROJECT_ID,
  });

  console.log(`→ Project: ${PROJECT_ID}`);

  for (const user of USERS) {
    console.log(`\n${user.email} (admin=${user.isAdmin})`);
    const uid = await getOrCreateUser(user);
    await setAdminClaim(uid, user.isAdmin);
    await upsertUserDoc(uid, user);
  }

  console.log("\n✓ Done. You can now sign in at /login with either user.");
  console.log("  Note: admin custom claim takes effect on the user's NEXT sign-in.");
  console.log("  If admin@trim-success.test is currently signed in somewhere,");
  console.log("  sign out and back in for the claim to propagate.");

  process.exit(0);
}

main().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
