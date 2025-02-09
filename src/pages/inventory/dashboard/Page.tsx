import { useMemo, useState } from "react";

import Filter1OutlinedIcon from "@mui/icons-material/Filter1Outlined";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { Box, Chip, Container, Grid, Typography } from "@mui/material";
import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import { Link } from "react-router-dom";
import { PageContent, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";
import { ROUTES } from "src/lib/consts";

import { GraphContainer } from "./components";
import {
  ICCGraph,
  ICCvsSalesGraph,
  ICRGraph,
  InventoryValueAddedGraph,
  InventoryValueOverSalesGraph,
} from "../inventory-performance/components";

const Page = () => {
  const cube = useCube();
  const [expandedGraph, setExpandedGraph] = useState("");

  const _graphs = useMemo(() => {
    if (!cube.data) return [];
    return [
      {
        key: EInventoryPerformaceMetricType.ICR_PERCENTAGE,
        component: (
          <ICRGraph
            isExpanded={
              expandedGraph === EInventoryPerformaceMetricType.ICR_PERCENTAGE
            }
            data={
              cube.data.inventoryPerformanceData.rows.find(
                (x) => x.key === EInventoryPerformaceMetricType.ICR_PERCENTAGE
              )!
            }
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
      {
        key: "icc",
        component: (
          <ICCGraph
            isExpanded={expandedGraph === "icc"}
            scorecard={cube.data.scorecardData}
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
      {
        key: EInventoryPerformaceMetricType.ICC_OVER_SALES,
        component: (
          <ICCvsSalesGraph
            isExpanded={
              expandedGraph === EInventoryPerformaceMetricType.ICC_OVER_SALES
            }
            data={
              cube.data.inventoryPerformanceData.rows.find(
                (x) => x.key === EInventoryPerformaceMetricType.ICC_OVER_SALES
              )!
            }
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
      {
        key: EInventoryPerformaceMetricType.INVENTORY_VALUE_OVER_AVG_SALES,
        component: (
          <InventoryValueOverSalesGraph
            isExpanded={
              expandedGraph ===
              EInventoryPerformaceMetricType.INVENTORY_VALUE_OVER_AVG_SALES
            }
            data={
              cube.data.inventoryPerformanceData.rows.find(
                (x) =>
                  x.key ===
                  EInventoryPerformaceMetricType.INVENTORY_VALUE_OVER_AVG_SALES
              )!
            }
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
      {
        key: EInventoryPerformaceMetricType.INVENTORY_VALUE_ADDED,
        component: (
          <InventoryValueAddedGraph
            isExpanded={
              expandedGraph ===
              EInventoryPerformaceMetricType.INVENTORY_VALUE_ADDED
            }
            data={
              cube.data.inventoryPerformanceData.rows.find(
                (x) =>
                  x.key === EInventoryPerformaceMetricType.INVENTORY_VALUE_ADDED
              )!
            }
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
    ].sort((a, b) => {
      if (expandedGraph === a.key) return -1;
      if (expandedGraph === b.key) return 1;
      return 0;
    });
  }, [cube.data, expandedGraph]);

  if (cube.isCubeLoading || !cube.data) return null;

  return (
    <PageWrapper title="Panel" useContainer={false}>
      <Box position={"relative"}>
        <Box
          sx={{
            left: 0,
            right: 0,
            height: 400,
            top: 0,
            zIndex: 0,
            position: "absolute",
            bgcolor: "black",
            borderRadius: {
              md: 0,
              lg: 4,
            },
            mx: {
              md: 0,
              lg: 2,
            },
          }}
        />
        <Container sx={{ zIndex: 1, position: "relative" }}>
          <Box component={"header"} pt={4} mb={8}>
            <Typography
              color="white"
              variant="h4"
              component="h1"
              fontWeight={600}
            >
              <strong>Panel</strong>
            </Typography>
            <Typography color="white" variant="body1">
              Vista general del comportamiento del negocio
            </Typography>
            <Box mt={2}>
              <Link
                to={ROUTES.INVENTORY.IMPORT}
                style={{ textDecoration: "none" }}
              >
                <Chip
                  label="Archivos Importados"
                  color="primary"
                  icon={<SaveAltIcon />}
                  variant="filled"
                  clickable
                />
              </Link>
              <Link
                to={ROUTES.INVENTORY.DATA_MINING}
                style={{ textDecoration: "none", marginLeft: 12 }}
              >
                <Chip
                  sx={{
                    bgcolor: "#333",
                    color: "white",
                  }}
                  label="Data Mining"
                  icon={<Filter1OutlinedIcon color="secondary" />}
                  variant="outlined"
                  clickable
                />
              </Link>
            </Box>
          </Box>
          <PageContent>
            <Typography variant="h6" component="h2" mb={2} color={"white"}>
              Indicadores de desempeño
            </Typography>
            <Grid container spacing={2}>
              {_graphs.map((graph) => (
                <GraphContainer
                  key={graph.key}
                  isExpanded={expandedGraph === graph.key}
                  setIsExpanded={() =>
                    setExpandedGraph(
                      expandedGraph === graph.key ? "" : graph.key
                    )
                  }
                >
                  {graph.component}
                </GraphContainer>
              ))}
            </Grid>
          </PageContent>
        </Container>
      </Box>
    </PageWrapper>
  );
};

export default Page;
