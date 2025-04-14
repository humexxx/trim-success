import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Toolbar,
  Link,
} from "@mui/material";
import { Logo } from "src/components";

const Footer = () => {
  return (
    <Box
      component={"footer"}
      sx={{ backgroundColor: "#1A1A1A", py: 4, color: "white", mt: 8 }}
    >
      <Toolbar sx={{ display: { xs: "none", sm: "block" } }} />
      <Container maxWidth="xl">
        <Stack spacing={8}>
          <Logo />
          <Grid container>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <Stack spacing={2}>
                <Typography color="inherit" variant="body1" gutterBottom>
                  Compañía
                </Typography>
                <Typography
                  component={Link}
                  href="/about"
                  color="inherit"
                  variant="body2"
                >
                  Acerca de nosotros
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <Stack spacing={2}>
                <Typography color="inherit" variant="body1" gutterBottom>
                  Servicios
                </Typography>
                <Typography
                  component={Link}
                  href="/features/inventory"
                  color="inherit"
                  variant="body2"
                >
                  Inventario
                </Typography>
                <Typography
                  component={Link}
                  href="/features/sales"
                  color="inherit"
                  variant="body2"
                >
                  Ventas
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent={"space-between"}>
            <Stack direction="row" spacing={2}>
              Socials
            </Stack>
            <Typography
              component={Link}
              href="/help"
              color="inherit"
              variant="body2"
            >
              Ayuda
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
