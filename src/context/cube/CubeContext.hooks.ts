import { useContext } from "react";
import { CubeContext } from "./CubeProvider";
import { CubeContextType } from "./CubeContext.types";

export function useCube(): CubeContextType {
  const context = useContext(CubeContext);
  if (!context) {
    throw new Error("useCube must be used within an CubeProvider");
  }
  return context;
}
