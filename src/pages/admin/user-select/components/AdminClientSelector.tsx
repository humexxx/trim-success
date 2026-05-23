import { useEffect } from "react";

import { IUser } from "@shared/models";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/hooks";
import { useLocalStorage } from "src/hooks";
import { LOCAL_STORAGE_KEYS, ROUTES } from "src/lib/consts";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUsers } from "../hooks";

const AdminClientSelector = () => {
  const { users, loading } = useUsers();
  const { setCustomUser, customUser } = useAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useLocalStorage<IUser | null>(
    LOCAL_STORAGE_KEYS.CUSTOM_USER,
    null
  );

  useEffect(() => {
    if (customUser?.uid && users.length > 0) {
      const user = users.find((u) => u.uid === customUser.uid);
      if (user) setSelectedUser(user);
    }
  }, [customUser?.uid, setSelectedUser, users]);

  async function handleOnClick() {
    if (selectedUser) {
      setCustomUser(selectedUser);
      navigate(ROUTES.INVENTORY.DASHBOARD);
    }
  }

  const handleUserChange = (uid: string) => {
    const next = users.find((u) => u.uid === uid) ?? null;
    setSelectedUser(next);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="client-select">Select User</Label>
        <Select
          value={selectedUser?.uid}
          onValueChange={handleUserChange}
          disabled={loading}
        >
          <SelectTrigger id="client-select">
            <SelectValue placeholder="Selecciona un usuario">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando...
                </span>
              ) : (
                selectedUser?.name ?? selectedUser?.email
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.uid} value={user.uid}>
                {user.name ?? user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleOnClick} disabled={!selectedUser || loading}>
        Cargar
      </Button>
    </div>
  );
};

export default AdminClientSelector;
