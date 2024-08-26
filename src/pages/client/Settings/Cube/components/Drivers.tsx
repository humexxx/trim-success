import {
  CircularProgress,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";
import { IDriver } from "src/models";

interface Props {
  drivers?: IDriver[];
  loading: boolean;
  error: string | null;
}

const Drivers = ({ drivers, loading, error }: Props) => {
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
      <List disablePadding>
        {drivers?.map((driver, index) => (
          <ListItem key={index}>
            <ListItemText primary={driver.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Drivers;
