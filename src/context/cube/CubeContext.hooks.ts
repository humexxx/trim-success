import { useContext } from "react";
import { CubeContext, CubeContextType } from "./CubeProvider";

export function useCube(): CubeContextType {
  const context = useContext(CubeContext);
  if (!context) {
    throw new Error("useCube must be used within an CubeProvider");
  }
  return context;
}
