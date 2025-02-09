import InventoryIcon from "@mui/icons-material/Inventory";
import SellIcon from "@mui/icons-material/Sell";
import { Box, Container, Grid, Stack } from "@mui/material";
import { CardButton } from "src/components";
import { PageHeader } from "src/components/layout";
import { ROUTES } from "src/lib/consts";

const ModuleSelector = () => {
  return (
    <Container maxWidth="md">
      <Stack spacing={4} mt={4}>
        <PageHeader title="Seleccionar Módulo" />
        <Box>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <CardButton
                icon={<InventoryIcon color="secondary" />}
                label="Inventario"
                description="Manejar los datos de inventario."
                elevation={3}
                isLink
                to={ROUTES.INVENTORY.DASHBOARD}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <CardButton
                icon={<SellIcon color="secondary" />}
                label="Ventas"
                description="Manejar los datos de ventas."
                disabled
                elevation={3}
                isLink
                to={ROUTES.SALES}
              />
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
};

export default ModuleSelector;
