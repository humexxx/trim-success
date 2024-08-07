import { useContext } from "react";
import CubeContext from "./CubeContext";

export function useCube() {
  const context = useContext(CubeContext);
  if (!context) {
    throw new Error("useCube must be used within an CubeProvider");
  }
  return context;
}
