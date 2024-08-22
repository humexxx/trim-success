import { useEffect, useState } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { useCube } from "src/context/cube";
import { useUsers, User } from "./AdminClientSelector.hooks";
import { LoadingButton } from "@mui/lab";

const AdminClientSelector = () => {
  const { users, loading } = useUsers();
  const cube = useCube();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (cube.customUid && users.length > 0) {
      const user = users.find((u) => u.uid === cube.customUid);
      if (user) {
        setSelectedUser(user);
      }
    }
  }, [cube.customUid, users]);

  function handleOnClick() {
    if (selectedUser) {
      cube.setCustomUid(selectedUser.uid);
    }
  }

  const handleUserChange = (_: React.SyntheticEvent, value: User | null) => {
    setSelectedUser(value);
  };

  return (
    <>
      <Box mt={2}>
        <Autocomplete
          options={users}
          getOptionLabel={(option: User) => option.name ?? option.email}
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
      </Box>
      <Box sx={{ my: 2 }}>
        <LoadingButton
          variant="contained"
          onClick={handleOnClick}
          sx={{ mt: 1, mr: 1 }}
          loading={cube.loading}
          disabled={!selectedUser || loading}
        >
          Terminar
        </LoadingButton>
      </Box>
    </>
  );
};

export default AdminClientSelector;