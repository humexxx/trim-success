import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { IColumn } from "src/models";

interface Props {
  columns?: IColumn[];
}

const Columns = ({ columns }: Props) => {
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
