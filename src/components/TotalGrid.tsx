import { useEffect } from "react";

import {
  DataGrid,
  DataGridProps,
  GridEventListener,
  useGridApiRef,
} from "@mui/x-data-grid";

interface TotalGridProps extends DataGridProps {
  onTotalGridScroll?: (left: number) => void;
}

export default function TotalGrid({
  onTotalGridScroll,
  ...props
}: TotalGridProps) {
  const apiRef = useGridApiRef();

  useEffect(() => {
    if (!onTotalGridScroll) return;
    const handleScroll: GridEventListener<"scrollPositionChange"> = (
      params
    ) => {
      onTotalGridScroll?.(params.left);
    };

    return apiRef.current.subscribeEvent("scrollPositionChange", handleScroll);
  }, [apiRef, onTotalGridScroll]);

  return (
    <DataGrid
      apiRef={apiRef}
      {...props}
      hideFooter
      disableColumnMenu
      disableColumnFilter
      disableColumnSorting
      sx={{
        "& .bold *": { fontWeight: "bold" },
        "& .MuiDataGrid-overlay": { display: "none" },
        ...props.sx,
      }}
    />
  );
}
