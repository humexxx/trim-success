/**
 * Idempotent seed script: creates a demo + admin Firebase Auth user in
 * the production "trim-success" project and sets the admin custom claim.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
 *     npx tsx scripts/seed-demo-accounts.ts
 *
 * What it does (all are no-ops if state already matches):
 *   1. Creates demo@trim-success.test (or updates the password).
 *   2. Creates admin@trim-success.test (or updates the password).
 *   3. Sets {admin: true} custom claim on the admin user.
 *
 * What it does NOT do:
 *   - Touch Firestore. No documents are written.
 *   - Seed any cube data, drivers, or settings.
 *   - Charge anything beyond the Firebase Auth free tier (50k MAU).
 *
 * If you want to wipe these users, delete them in Firebase Console
 * → Authentication, then re-run.
 */

import admin from "firebase-admin";

interface SeedUser {
  email: string;
  password: string;
  displayName: string;
  isAdmin: boolean;
}

const USERS: SeedUser[] = [
  {
    email: "demo@trim-success.test",
    password: "Demo1234!",
    displayName: "Demo User",
    isAdmin: false,
  },
  {
    email: "admin@trim-success.test",
    password: "Admin1234!",
    displayName: "Admin User",
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

async function main() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error(
      "✗ Missing GOOGLE_APPLICATION_CREDENTIALS env var.\n" +
        "  Set it to the path of your Firebase service account JSON.\n" +
        "  Download from: Firebase Console → Project Settings → Service Accounts."
    );
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });

  console.log(
    `→ Project: ${admin.app().options.projectId ?? "(from credentials)"}`
  );

  for (const user of USERS) {
    console.log(`\n${user.email} (admin=${user.isAdmin})`);
    const uid = await getOrCreateUser(user);
    await setAdminClaim(uid, user.isAdmin);
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
