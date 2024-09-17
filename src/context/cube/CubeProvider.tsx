import { createContext, ReactNode, useEffect, useState } from "react";
import { CubeContextType, FileResolution } from "./CubeContext.types";
import { useAuth } from "../auth";
import CubeLoader from "./CubeLoader";
import { ICubeData } from "src/models";
import { functions } from "src/firebase";
import { httpsCallable } from "firebase/functions";
import { GlobalLoader } from "src/components";
import { useNavigate } from "react-router-dom";

export const CubeContext = createContext<CubeContextType | undefined>(
  undefined
);

interface CubeProviderProps {
  children: ReactNode;
}

export default function CubeProvider({ children }: CubeProviderProps) {
  const [fileResolution, setFileResolution] = useState<
    FileResolution | undefined
  >(undefined);
  const user = useAuth();
  const [hasInitialData, setHasInitialData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoadingCube, setIsLoadingCube] = useState(false);
  const [data, setData] = useState<ICubeData | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const getCubeData = httpsCallable(functions, "getCubeData");
      try {
        const response = await getCubeData(); // pass customUid here for admin
        const data = response.data as
          | ICubeData
          | { error: string; noParams?: boolean };
        if ("noParams" in data) {
          setLoading(false);
          navigate("/client/import", { replace: true });
          return;
        }
        setHasInitialData(true);

        if ("error" in data) {
          throw new Error(data.error);
        }
        setData(data);
      } catch (e) {
        console.error(e);
        setIsLoadingCube(true);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    loadData();
  }, []);

  const value: CubeContextType = {
    hasInitialData,
    setHasInitialData,
    fileResolution,
    setFileResolution,
    isLoadingCube,

    data,
    setData,
  };

  if (loading) return <GlobalLoader />;

  return (
    <CubeContext.Provider value={value}>
      <CubeLoader
        loadCube={isLoadingCube}
        setLoadCube={setIsLoadingCube}
        uid={user.currentUser?.isAdmin ? (user as any).customId : null} // agregar logica de admin
        setData={setData}
      />
      {children}
    </CubeContext.Provider>
  );
}
