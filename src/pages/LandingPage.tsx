import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import HandymanIcon from "@mui/icons-material/Handyman";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import HeroImage from "src/assets/images/hero.webp";
import { Logo } from "src/components";
import { FEATURES } from "src/consts";
import { useDocumentMetadata } from "src/hooks";
import { APP_NAME, ROUTES } from "src/lib/consts";

import FeatureCard from "./public/_components/FeatureCard";
import Footer from "./public/_components/Footer";
import Section from "./public/_components/Section";

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
      <AppBar position="relative">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Stack
              direction="row"
              spacing={8}
              alignItems="center"
              justifyContent={"space-between"}
              sx={{ flexGrow: 1 }}
            >
              <Logo />
              <Stack direction="row" spacing={2}>
                <Link to={ROUTES.SIGN_IN} style={{ textDecoration: "none" }}>
                  <Button
                    sx={{ color: "white", textDecoration: "none" }}
                    size="small"
                  >
                    Inicia sesión
                  </Button>
                </Link>
              </Stack>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Container component={"main"}>
        {/* Hero Section */}
        <Section>
          <Typography variant="h1" fontWeight={700} mb={4}>
            Maneja tu inventario con <br />
            ScorChain
          </Typography>
          <Grid container spacing={8}>
            <Grid size={6}>
              <Timeline sx={{ "& li::before": { display: "none" } }}>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot>
                      <HandymanIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="body2" mt={1.75}>
                      Llena el formulario
                    </Typography>
                    <Box pt={4} pb={2}>
                      <TextField label="Email" fullWidth />
                    </Box>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot>
                      <AddLocationAltIcon />
                    </TimelineDot>
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="body2" mt={1.75}>
                      Selecciona los datos adicionales de tu negocio
                    </Typography>
                    <Box pt={4}>
                      <Grid container spacing={2}>
                        <Grid size={12}>
                          <TextField label="Negocio" fullWidth />
                        </Grid>
                        <Grid size={12}>
                          <TextField label="Lugar" fullWidth />
                        </Grid>
                        <Grid size={12}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            alignItems={"center"}
                          >
                            <Link
                              to={ROUTES.SIGN_IN}
                              style={{ textDecoration: "none" }}
                            >
                              <Button
                                sx={{ color: "white", textDecoration: "none" }}
                                variant="contained"
                              >
                                Enviar Consulta
                              </Button>
                            </Link>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </Grid>
            <Grid size={6}>
              <Box
                sx={{
                  position: "relative",
                  height: 400,
                  aspectRatio: "16 / 9",
                  mt: 2,
                }}
              >
                <img
                  src={HeroImage}
                  alt="Nubi-Go hero"
                  style={{
                    objectFit: "cover",
                    borderRadius: 8,
                    height: "100%",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Section>

        <Section>
          <Typography variant="h3" component={"h2"} fontWeight={700} mb={4}>
            Servicios
          </Typography>
          <Grid container spacing={4}>
            {FEATURES.map(({ id, ...props }) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={id}>
                <FeatureCard {...props} />
              </Grid>
            ))}
          </Grid>
        </Section>
      </Container>

      <Footer />
    </Box>
  );
};

export default LandingPage;
