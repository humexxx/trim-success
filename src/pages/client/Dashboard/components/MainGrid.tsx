import StripedGrid from "src/components/StripedDataGrid";
import { useCube } from "src/context/hooks";

const MainGrid = () => {
  const cube = useCube();

  return (
    <StripedGrid
      rows={cube.fileData?.rows ?? []}
      columns={(cube.fileData?.columns as any) ?? []}
    />
  );
};

export default MainGrid;
