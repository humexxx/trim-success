import { useEffect, useMemo, useRef, useState } from "react";

import { Alert, Stack } from "@mui/material";
import { GridColDef, useGridApiRef } from "@mui/x-data-grid";
import { STORAGE_PATH } from "@shared/consts";
import { EColumnType } from "@shared/enums";
import { ESystemColumnType } from "@shared/enums/ESystemColumnType";
import { IColumn, IDataModel, IDataModelCubeRow } from "@shared/models";
import { formatCurrency, formatPercentage, getColumn } from "@shared/utils";
import { listAll, getMetadata, getDownloadURL, ref } from "firebase/storage";
import StripedGrid from "src/components/StripedDataGrid";
import { useAuth } from "src/context/hooks";
import { storage } from "src/firebase";
import { getError } from "src/utils";

import Filters, { IFilterCriteria } from "./Filters";

function getColumns(columns?: string[]): GridColDef[] {
  if (!columns) {
    return [];
  }

  const skuColumn: IColumn = getColumn(EColumnType.SKU)!;
  const categoryColumn: IColumn = getColumn(EColumnType.CATEGORY)!;
  const grossMarginColumn: IColumn = getColumn(EColumnType.GROSS_MARGIN)!;

  const ircColumn: IColumn = getColumn(ESystemColumnType.ICR_PERCENTAGE)!;
  const iccColumn: IColumn = getColumn(ESystemColumnType.ICC)!;
  const evColumn: IColumn = getColumn(ESystemColumnType.EV)!;

  return [
    {
      field: columns[skuColumn.index!],
      headerName: skuColumn.name,
      flex: 1,
      minWidth: 200,
    },
    {
      field: columns[categoryColumn.index!],
      headerName: categoryColumn.name,
      width: 200,
    },
    {
      field: columns[grossMarginColumn.index!],
      headerName: grossMarginColumn.name,
      width: 125,
      valueGetter: (value: string) => parseFloat(value),
      valueFormatter: (value: number) => formatCurrency(value),
    },
    {
      field: ircColumn.code,
      headerName: ircColumn.name,
      width: 125,
      valueFormatter: (value: number) => formatPercentage(value),
    },
    {
      field: iccColumn.code,
      headerName: iccColumn.name,
      width: 125,
      valueFormatter: (value: number) => formatCurrency(value),
    },
    {
      field: evColumn.code,
      headerName: evColumn.name,
      width: 125,
      valueFormatter: (value: number) => formatCurrency(value),
    },
  ];
}

const MainGrid = () => {
  const { isAdmin, customUser, currentUser } = useAuth();
  const apiRef = useGridApiRef();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IFilterCriteria>({
    category: "",
  });
  const [dataModel, setDataModel] =
    useState<IDataModel<IDataModelCubeRow> | null>(null);
  const originalDataModel = useRef<IDataModel<IDataModelCubeRow> | null>(null);

  useEffect(() => {
    const fetchJsonFile = async () => {
      setLoading(true);
      try {
        const folderRef = ref(
          storage,
          `${STORAGE_PATH}/${isAdmin ? customUser?.uid : currentUser?.uid}/`
        );
        const result = await listAll(folderRef);

        for (const itemRef of result.items) {
          const metadata = await getMetadata(itemRef);

          if (metadata.contentType === "application/json") {
            const downloadURL = await getDownloadURL(itemRef);

            const response = await fetch(downloadURL);
            const dataModel =
              (await response.json()) as IDataModel<IDataModelCubeRow>;

            setDataModel(dataModel);
            originalDataModel.current = dataModel;
            break;
          }
        }
      } catch (error) {
        setError(getError(error));
      } finally {
        setLoading(false);
      }
    };
    fetchJsonFile();
  }, [currentUser?.uid, customUser?.uid, isAdmin]);

  useEffect(() => {
    if (!originalDataModel.current) {
      return;
    }

    let _rows = [...originalDataModel.current!.rows];
    if (filters.category) {
      _rows = _rows.filter(
        (row) =>
          row[
            originalDataModel.current!.columns[
              getColumn(EColumnType.CATEGORY)!.index!
            ]
          ] === filters.category
      );
    }
    if (filters.expetedValue) {
      _rows = _rows.filter((row) => {
        const ev = row[getColumn(ESystemColumnType.EV)!.code!] as number;
        return filters.expetedValue === "positive" ? ev > 0 : ev < 0;
      });
    }

    setDataModel((prev) => ({ ...prev!, rows: _rows }));
  }, [filters]);

  const columns = useMemo(
    () => getColumns(dataModel?.columns),
    [dataModel?.columns]
  );

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (loading || !dataModel) {
    return <Alert severity="info">Cargando...</Alert>;
  }

  return (
    <Stack spacing={2}>
      <Filters filters={filters} setFilters={setFilters} />
      <StripedGrid
        apiRef={apiRef}
        rows={dataModel.rows}
        columns={columns}
        hideFooter={false}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </Stack>
  );
};

export default MainGrid;
