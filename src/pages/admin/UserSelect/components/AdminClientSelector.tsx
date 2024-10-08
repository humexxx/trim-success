import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useAuth } from "src/context/auth";
import { IUser } from "@shared/models";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../hooks";

const AdminClientSelector = () => {
  const { users, loading } = useUsers();
  const { setCustomUser, customUser } = useAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (customUser?.uid && users.length > 0) {
      const user = users.find((u) => u.uid === customUser.uid);
      if (user) {
        setSelectedUser(user);
      }
    }
  }, [customUser?.uid, users]);

  async function handleOnClick() {
    if (selectedUser) {
      setCustomUser(selectedUser);
      navigate("/client/dashboard");
    }
  }

  const handleUserChange = (_: React.SyntheticEvent, value: IUser | null) => {
    setSelectedUser(value);
  };

  return (
    <>
      <Autocomplete
        options={users}
        getOptionLabel={(option: IUser) => option.name ?? option.email}
        loading={loading}
        onChange={handleUserChange}
        disableClearable
        value={selectedUser as any}
        renderInput={(params) => (
          <TextField
            {...params}
            disabled={loading}
            label="Select User"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <Box sx={{ my: 2 }}>
        <Button
          variant="contained"
          onClick={handleOnClick}
          sx={{ mt: 1, mr: 1 }}
          disabled={!selectedUser || loading}
        >
          Cargar
        </Button>
      </Box>
    </>
  );
};

export default AdminClientSelector;
