import { createContext, ReactNode, useEffect, useState } from "react";
import { CubeContextType, FileResolution } from "./CubeContext.types";
import { useAuth } from "../auth";
import { getBlob, listAll, ref } from "firebase/storage";
import { STORAGE_PATH } from "src/consts";
import {
  getColsAndRowsAsync,
  getGeneralDataAsync,
  getJsonDataFromFileAsync,
} from "src/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { storage } from "src/firebase";
import { useDataParams } from "src/pages/client/GeneralData/hooks";

export const CubeContext = createContext<CubeContextType | undefined>(
  undefined
);

interface CubeProviderProps {
  fallbackRoute: string;
  successRoute: string;
  children: ReactNode;
}

export default function CubeProvider({
  children,
  fallbackRoute,
  successRoute,
}: CubeProviderProps) {
  const [fileResolution, setFileResolution] = useState<
    FileResolution | undefined
  >(undefined);
  const user = useAuth();
  const [loading, setLoading] = useState(false);
  const [customUid, setCustomUid] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation();
  const dataParams = useDataParams();

  async function loadFile(uid?: string) {
    if (!uid) {
      navigate(fallbackRoute, { replace: true });
      setLoading(false);
    }

    setLoading(true);
    const folderRef = ref(storage, `${STORAGE_PATH}/${uid}/`);

    try {
      const result = await listAll(folderRef);
      if (result.items.length > 0) {
        const firstFileRef = result.items[0];
        const fileBlob = await getBlob(firstFileRef);

        const jsonData = await getJsonDataFromFileAsync(fileBlob);
        const { columns, rows } = await getColsAndRowsAsync(jsonData);
        setFileResolution({
          columns,
          rows,
          file: { ...fileBlob, name: firstFileRef.name },
          jsonData,
        });
        if (location.pathname !== "/client/user") navigate(successRoute);
        setLoading(false);
      } else {
        navigate(fallbackRoute, { replace: true });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   loadFile(user.currentUser!.isAdmin ? customUid : user.currentUser!.uid);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [customUid]);

  useEffect(() => {
    async function calculateGeneralParams() {
      const { sumCostSales, sumSales, categories } = await getGeneralDataAsync(
        fileResolution?.rows
      );

      dataParams.updateMemoryDataParams({
        inventoryParams: {
          energyCost: 0,
          insuranceCost: 0,
          manoObraCost: 0,

          officeSpaceCost: 0,
          officeSupplyCost: 0,
          otherCosts: 0,
        },
        storingParams: {
          alquilerCost: 0,
          energiaCost: 0,
          manoObraCost: 0,
          otherCosts: 0,
          suministroOficinaCost: 0,
          tercerizacionCost: 0,
        },
        generalParams: {
          financial: {
            sales: sumSales,
            salesCost: sumCostSales,
            companyCapitalCost: 0,
            inventoryAnnualCost: 0,
            technologyCapitalCost: 0,
          },
          operational: {
            annualWorkingHours: 0,
          },
        },
        categories,
      });
    }

    if (fileResolution && !dataParams.loading && !dataParams.data) {
      calculateGeneralParams();
    }
  }, [dataParams, fileResolution]);

  const value: CubeContextType = {
    fileResolution,
    loading: loading,
    setFileResolution,
    customUid,
    setCustomUid,
    dataParams,
  };

  return <CubeContext.Provider value={value}>{children}</CubeContext.Provider>;
}
