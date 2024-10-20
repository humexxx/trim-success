import { useCallback, useEffect, useRef, useState } from "react";

import { Grid } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import {
  DataGrid,
  DataGridProps,
  gridClasses,
  GridEventListener,
} from "@mui/x-data-grid";

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
  const ref = useRef<HTMLDivElement | null>(null);
  const [isRendered, setIsRendered] = useState(false);

  const onTotalGridScroll = useCallback((left: number) => {
    const gridElement = ref.current?.querySelector(
      ".MuiDataGrid-virtualScroller"
    ) as HTMLElement;
    gridElement.scrollLeft = left;
  }, []);

  const handleStateChange: GridEventListener<"stateChange"> = () => {
    if (!isRendered) {
      setIsRendered(true);
    }
  };

  useEffect(() => {
    if (isRendered && Boolean(totalColumns)) {
      const divElement = ref.current?.querySelector(
        ".MuiDataGrid-virtualScroller"
      ) as HTMLElement;

      if (divElement) {
        const handleWheel = (event: WheelEvent) => {
          event.preventDefault();
        };

        const handleTouchMove = (event: TouchEvent) => {
          event.preventDefault();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
          const keys = [
            "ArrowUp",
            "ArrowDown",
            "PageUp",
            "PageDown",
            "Home",
            "End",
          ];
          if (keys.includes(event.key)) {
            event.preventDefault();
          }
        };

        divElement.addEventListener("wheel", handleWheel, { passive: false });
        divElement.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        window.addEventListener("keydown", handleKeyDown);

        return () => {
          divElement.removeEventListener("wheel", handleWheel);
          divElement.removeEventListener("touchmove", handleTouchMove);
          window.removeEventListener("keydown", handleKeyDown);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRendered]);

  return (
    <>
      <Grid item>
        <StripedDataGrid
          density="compact"
          hideFooter
          ref={ref}
          disableColumnResize
          onStateChange={handleStateChange}
          {...props}
          sx={{
            "& .MuiDataGrid-columnHeader *": { fontWeight: "bold" },
            "& .MuiDataGrid-cell": { fontSize: 12 },
            "& .MuiDataGrid-columnHeaderTitle": { fontSize: 12 },
            "& .MuiDataGrid-filler, & .MuiDataGrid-scrollbar": {
              height: totalColumns ? "0px !important" : 17,
            },
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
        />
      </Grid>
      {totalColumns && (
        <Grid item>
          <TotalGrid
            columns={totalColumns}
            onTotalGridScroll={onTotalGridScroll}
            disableColumnResize
          />
        </Grid>
      )}
    </>
  );
}
