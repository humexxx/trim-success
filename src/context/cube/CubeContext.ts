import { createContext } from "react";
import { CubeContextType } from "./CubeContext.types";

const CubeContext = createContext<CubeContextType | undefined>(undefined);

export default CubeContext;
