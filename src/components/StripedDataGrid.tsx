import { Grid } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { DataGrid, DataGridProps, gridClasses } from "@mui/x-data-grid";

import TotalGrid from "./TotalGrid";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.odd`]: {
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
  [`& .${gridClasses.row}.even`]: {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[900],
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

interface Props extends DataGridProps {
  totalColumns?: DataGridProps["columns"];
}

export default function StripedGrid({ totalColumns, ...props }: Props) {
  return (
    <>
      <Grid item>
        <StripedDataGrid
          {...props}
          sx={{
            "& .MuiDataGrid-columnHeader *": { fontWeight: "bold" },
            "& .MuiDataGrid-cell": { fontSize: 12 },
            "& .MuiDataGrid-columnHeaderTitle": { fontSize: 12 },
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          density="compact"
          hideFooter
        />
      </Grid>
      {totalColumns && (
        <Grid item>
          <TotalGrid columns={totalColumns} />
        </Grid>
      )}
    </>
  );
}
