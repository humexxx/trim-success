import { useEffect, useMemo, useRef, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { STORAGE_PATH } from "@shared/consts";
import { EColumnType } from "@shared/enums";
import { ESystemColumnType } from "@shared/enums/ESystemColumnType";
import { IColumn, IDataModel, IDataModelCubeRow } from "@shared/models";
import { formatAmount, formatPercentage, getColumn } from "@shared/utils";
import { getDownloadURL, getMetadata, listAll, ref } from "firebase/storage";
import { useAuth } from "src/context/hooks";
import { storage } from "src/lib/firebase";
import { getError } from "src/utils";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataTable } from "@/components/DataTable";

import Filters, { IFilterCriteria } from "./Filters";

function getColumns(
  columns?: string[]
): ColumnDef<IDataModelCubeRow>[] {
  if (!columns) return [];

  const skuColumn = getColumn(EColumnType.SKU)!;
  const categoryColumn = getColumn(EColumnType.CATEGORY)!;
  const grossMarginColumn = getColumn(EColumnType.GROSS_MARGIN)!;
  const ircColumn = getColumn(ESystemColumnType.ICR_PERCENTAGE)!;
  const iccColumn = getColumn(ESystemColumnType.ICC)!;
  const evColumn = getColumn(ESystemColumnType.EV)!;

  return [
    {
      accessorKey: columns[skuColumn.index!],
      header: skuColumn.name,
    },
    {
      accessorKey: columns[categoryColumn.index!],
      header: categoryColumn.name,
    },
    {
      accessorKey: columns[grossMarginColumn.index!],
      header: grossMarginColumn.name,
      cell: ({ getValue }) => formatAmount(parseFloat(getValue() as string)),
    },
    {
      accessorKey: ircColumn.code,
      header: ircColumn.name,
      cell: ({ getValue }) => formatPercentage(getValue() as number),
    },
    {
      accessorKey: iccColumn.code,
      header: iccColumn.name,
      cell: ({ getValue }) => formatAmount(getValue() as number),
    },
    {
      accessorKey: evColumn.code,
      header: evColumn.name,
      cell: ({ getValue }) => formatAmount(getValue() as number),
    },
  ] satisfies ColumnDef<IDataModelCubeRow>[];
}

const MainGrid = () => {
  const { isAdmin, customUser, currentUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IFilterCriteria>({ category: "" });
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
            const dm = (await response.json()) as IDataModel<IDataModelCubeRow>;
            setDataModel(dm);
            originalDataModel.current = dm;
            break;
          }
        }
      } catch (e) {
        setError(getError(e));
      } finally {
        setLoading(false);
      }
    };
    fetchJsonFile();
  }, [currentUser?.uid, customUser?.uid, isAdmin]);

  useEffect(() => {
    if (!originalDataModel.current) return;

    let _rows = [...originalDataModel.current.rows];
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
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading || !dataModel) {
    return (
      <Alert>
        <AlertDescription>Cargando...</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Filters filters={filters} setFilters={setFilters} />
      <DataTable
        data={dataModel.rows}
        columns={columns}
        pagination={{ initialPageSize: 20, pageSizeOptions: [10, 20, 50, 100] }}
      />
    </div>
  );
};

export default MainGrid;
