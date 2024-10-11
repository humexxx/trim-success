import { useState, useEffect } from "react";

import { IUser } from "@shared/models";
import { getDocs, collection } from "firebase/firestore";
import { firestore } from "src/firebase";

const useUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "users"));
        const usersList = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        })) as IUser[];
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
