import {
  CircularProgress,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";
import { IColumn } from "src/models";

interface Props {
  columns?: IColumn[];
  loading: boolean;
  error: string | null;
}

const Columns = ({ columns, loading, error }: Props) => {
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Columns
      </Typography>
      <List disablePadding>
        {columns?.map(({ name }, index) => (
          <ListItem key={index}>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Columns;
