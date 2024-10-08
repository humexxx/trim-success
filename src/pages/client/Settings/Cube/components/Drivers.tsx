import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { IDriver } from "@shared/models";

interface Props {
  drivers?: IDriver[];
}

const Drivers = ({ drivers }: Props) => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Drivers
      </Typography>
      <List disablePadding>
        {drivers?.map((driver, index) => (
          <ListItem key={index}>
            <ListItemText primary={driver.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Drivers;
