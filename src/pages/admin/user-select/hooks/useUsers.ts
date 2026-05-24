import { useState, useEffect } from "react";

import { IUser } from "@shared/models";
import { getDocs, collection } from "firebase/firestore";
import { DEV_ACCOUNT_EMAILS } from "src/lib/consts";
import { firestore } from "src/lib/firebase";

/**
 * Returns the impersonatable users. The Firestore `users` collection
 * may contain many real accounts; we filter down to the demo allowlist
 * (the same emails surfaced as quick-login buttons on the sign-in
 * page) so admins can't accidentally view a real customer's cube.
 */
const useUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "users"));
        const allowed = new Set<string>(DEV_ACCOUNT_EMAILS);
        const usersList = querySnapshot.docs
          .map((doc) => ({ uid: doc.id, ...doc.data() }) as IUser)
          .filter((u) => u.email && allowed.has(u.email));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading };
};

export default useUsers;
