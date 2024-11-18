import { Grid, TextField, MenuItem, Button, ButtonGroup } from "@mui/material";
import { useCube } from "src/context/hooks";

export interface IFilterCriteria {
  category: string;
  expetedValue?: "positive" | "negative";
}

interface Props {
  filters: IFilterCriteria;
  setFilters: React.Dispatch<React.SetStateAction<IFilterCriteria>>;
}

const Filters = ({ filters, setFilters }: Props) => {
  const cube = useCube();

  if (!cube.data) return null;

  return (
    <Grid container gap={2}>
      <Grid item xs={4}>
        <TextField
          fullWidth
          select
          label="Categoria"
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
        >
          <MenuItem value="">Todas</MenuItem>
          {cube.data?.cubeParameters.categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={4}>
        <ButtonGroup aria-label="expected value filter">
          <Button
            variant={
              filters?.expetedValue === "positive" ? "contained" : "outlined"
            }
            color="success"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                expetedValue:
                  prev.expetedValue === "positive" ? undefined : "positive",
              }))
            }
          >
            Con Profit
          </Button>
          <Button
            variant={
              filters?.expetedValue === "negative" ? "contained" : "outlined"
            }
            color="error"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                expetedValue:
                  prev.expetedValue === "negative" ? undefined : "negative",
              }))
            }
          >
            Sin Profit
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

export default Filters;
