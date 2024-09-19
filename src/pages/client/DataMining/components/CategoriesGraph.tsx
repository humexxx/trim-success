import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { IBaseData } from "src/models";

interface Props {
  data?: IBaseData["categoriesData"];
}

const CategoriesGraph = ({ data }: Props) => {
  const [rows, setRows] = useState<IBaseData["categoriesData"]["rows"]>([]);

  useEffect(() => {
    if (data?.rows) {
      setRows(data.rows);
    }
  }, [data]);

  return <Box height={350}>Somo chart here</Box>;
};

export default CategoriesGraph;
