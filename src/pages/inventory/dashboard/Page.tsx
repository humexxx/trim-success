import { useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import { PageContent, PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";

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
          <Box component={"header"} pt={4}>
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
          </Box>
          <PageContent>
            <Grid container spacing={2} rowGap={2}>
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
