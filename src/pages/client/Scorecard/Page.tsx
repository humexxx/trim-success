import { Typography } from "@mui/material";
import { useMemo } from "react";
import { PageHeader } from "src/components";
import { useCube } from "src/context/cube";
import { useDocumentMetadata } from "src/hooks";
import { getColumnIndex, getRowValue } from "src/utils";

const Page = () => {
  useDocumentMetadata("Scorecard - Trim Success");
  const { globalSettings, fileResolution } = useCube();

  const categoryIndex = useMemo(() => {
    return getColumnIndex("category", globalSettings?.columns);
  }, [globalSettings?.columns]);

  const diffentCategories = useMemo(() => {
    if (!categoryIndex || !fileResolution?.rows) return [];
    return Array.from(
      new Set(fileResolution.rows.map((row) => getRowValue(row, categoryIndex)))
    );
  }, [categoryIndex, fileResolution?.rows]);

  return (
    <>
      <PageHeader title="Scorecard" description="Página de Scorecard" />
      <Typography variant="h6" gutterBottom>
        Categories Count: {diffentCategories.length}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Categories: {diffentCategories.join(", ")}
      </Typography>
    </>
  );
};

export default Page;
