import AssessmentIcon from "@mui/icons-material/Assessment";
import BarChartIcon from "@mui/icons-material/BarChart";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import EmailIcon from "@mui/icons-material/Email";
import InventoryIcon from "@mui/icons-material/Inventory";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import landing1 from "src/assets/images/landing_1.webp";
import { useDocumentMetadata } from "src/hooks";
import { APP_NAME, ROUTES } from "src/lib/consts";

const LandingPage = () => {
  useDocumentMetadata(APP_NAME);

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        color: "#000",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          color: "#000",
          boxShadow: 0,
          borderBottom: "1px solid #e0e0e0",
          backdropFilter: "saturate(180%) blur(5px)",
          bgcolor: "rgba(255, 255, 255, .8)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              ScorChain Inventory
            </Typography>
            <Link to={ROUTES.SIGN_IN} style={{ textDecoration: "none" }}>
              <Button sx={{ color: "black" }}>Inicia sesión</Button>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section with SVG Grid Lines */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          opacity: 0.2,
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="gridPattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#ccc"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
        </svg>
      </Box>
      <Container
        maxWidth="lg"
        sx={{ py: 24, textAlign: "center", position: "relative" }}
      >
        <Stack spacing={12}>
          <Typography
            variant="h1"
            fontSize={58}
            fontWeight={700}
            letterSpacing={"-0.125rem"}
            gutterBottom
          >
            Software para la Gestión de Inventario y Ventas
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            <strong>Optimiza</strong> el rendimiento de tu inventario con
            análisis de datos, métricas financieras y dashboards interactivos.{" "}
            <strong>Administra</strong> el ciclo de vida de tus productos y
            mejora la rentabilidad de tu negocio.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Link to={ROUTES.SIGN_IN} style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                sx={{ fontSize: "1rem" }}
                disableElevation
              >
                Empezar Ahora
              </Button>
            </Link>
            <Button variant="outlined" size="large" sx={{ fontSize: "1rem" }}>
              Más Información
            </Button>
          </Box>
        </Stack>
      </Container>

      <Container maxWidth="lg" sx={{ mt: 15, textAlign: "center" }}>
        <Stack spacing={8}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Del 15% al 25%
            <Typography
              variant="h6"
              component={"span"}
              color="text.secondary"
              ml={2}
            >
              del inventario no genera ganancias. ¿Cómo puedes mejorar?
            </Typography>
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined" sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Box
                    justifyContent={"center"}
                    display="flex"
                    alignItems={"center"}
                    height={200}
                  >
                    <InventoryIcon sx={{ fontSize: 50 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    textAlign={"left"}
                    gutterBottom
                  >
                    Scorecard Financiero
                  </Typography>
                  <Typography textAlign={"left"} color={"text.secondary"}>
                    Analiza la rentabilidad del inventario por categorías y SKU.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined" sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Box
                    justifyContent={"center"}
                    display="flex"
                    alignItems={"center"}
                    height={200}
                  >
                    <BusinessCenterIcon sx={{ fontSize: 50 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    textAlign={"left"}
                    gutterBottom
                  >
                    Gestión de Compras
                  </Typography>
                  <Typography textAlign={"left"} color={"text.secondary"}>
                    Controla el abastecimiento de productos y reduce costos.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Box
                    justifyContent={"center"}
                    display="flex"
                    alignItems={"center"}
                    height={200}
                  >
                    <BarChartIcon sx={{ fontSize: 50 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    textAlign={"left"}
                    gutterBottom
                  >
                    Análisis de Ventas
                  </Typography>
                  <Typography textAlign={"left"} color={"text.secondary"}>
                    Visualiza el rendimiento de tus ventas en tiempo real.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined" sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    textAlign={"left"}
                    gutterBottom
                  >
                    Reportes Personalizados
                  </Typography>
                  <Typography textAlign={"left"} color={"text.secondary"}>
                    Crea reportes a medida para tomar decisiones informadas.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined" sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    textAlign={"left"}
                    gutterBottom
                  >
                    Dashboard Interactivo
                  </Typography>
                  <Typography textAlign={"left"} color={"text.secondary"}>
                    Accede a métricas clave y análisis de datos en tiempo real.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined" sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    textAlign={"left"}
                    gutterBottom
                  >
                    Maneja las ventas
                  </Typography>
                  <Typography textAlign={"left"} color={"text.secondary"}>
                    Controla el ciclo de vida de tus productos y mejora la
                    rentabilidad.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>

      <Box
        sx={{
          py: 8,
          mt: 15,
          textAlign: "center",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Container maxWidth="xl">
          {/* footer */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} ScorChain Inventory. Todos los
              derechos reservados.
            </Typography>
            <Box>
              <IconButton>
                <EmailIcon />
              </IconButton>
              <IconButton>
                <AssessmentIcon />
              </IconButton>
              <IconButton>
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
