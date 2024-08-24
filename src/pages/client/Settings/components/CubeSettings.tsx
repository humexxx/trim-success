import {
  CircularProgress,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";
import { useSettingsCube } from "../hooks";

const CubeSettings = () => {
  const { settings, loading, error } = useSettingsCube();

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Drivers
      </Typography>
      <List>
        {settings?.drivers.map((driver, index) => (
          <ListItem key={index}>
            <ListItemText primary={driver.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CubeSettings;
