import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useCube } from "src/context/cube";
import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  paramsSchema,
  GeneralParams,
  StoringParams,
  InventoryParams,
} from "../../GeneralData";
import { getError, getGeneralDataAsync } from "src/utils";
import { useParamsData } from "../../GeneralData/hooks";
import { ICubeData, IParamsData } from "@shared/models";
import {
  DEFAULT_GENERAL_PARAMS,
  DEFAULT_INVENTORY_PARAMS,
  DEFAULT_STORING_PARAMS,
} from "@shared/consts";
import { FileResolution } from "./ImportDataPage";

interface Props {
  error: string;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  fileResolution: FileResolution;
}

const ParamsData = forwardRef(
  ({ error, loading, setError, setLoading, fileResolution }: Props, ref) => {
    const { data, setData } = useCube();
    const paramsData = useParamsData();

    const {
      formState: { errors },
      register,
      setValue,
      getValues,
      control,
    } = useForm<Omit<IParamsData, "categories" | "drivers">>({
      resolver: yupResolver(paramsSchema),
      defaultValues: {
        generalParams: DEFAULT_GENERAL_PARAMS,
        storingParams: DEFAULT_STORING_PARAMS,
        inventoryParams: DEFAULT_INVENTORY_PARAMS,
      },
    });

    useImperativeHandle(ref, () => ({
      saveData: () => {
        const _paramsData: IParamsData = {
          generalParams: getValues(
            "generalParams"
          ) as IParamsData["generalParams"],
          storingParams: getValues(
            "storingParams"
          ) as IParamsData["storingParams"],
          inventoryParams: getValues(
            "inventoryParams"
          ) as IParamsData["inventoryParams"],
          categories: data!.paramsData.categories!,
          drivers: data!.paramsData.drivers!,
        };
        paramsData.update(_paramsData);
        setData((prev) => ({
          ...(prev as ICubeData),
          paramsData: _paramsData,
        }));
      },
    }));

    useEffect(() => {
      async function calculateData() {
        setLoading(true);
        try {
          const { sumCostSales, sumSales, categories } =
            await getGeneralDataAsync(fileResolution?.rows);

          if (isNaN(sumCostSales) || isNaN(sumSales)) {
            throw new Error("Error al calcular los datos generales");
          }

          setValue("generalParams", {
            financial: [
              {
                ...DEFAULT_GENERAL_PARAMS.financial.find(
                  (param) => param.key === "sales"
                )!,
                value: sumSales,
              },
              {
                ...DEFAULT_GENERAL_PARAMS.financial.find(
                  (param) => param.key === "salesCost"
                )!,
                value: sumCostSales,
              },
              ...DEFAULT_GENERAL_PARAMS.financial.slice(2),
            ],
            operational: DEFAULT_GENERAL_PARAMS.operational,
          });

          setData((prev) => ({
            ...(prev as ICubeData),
            paramsData: {
              ...prev!.paramsData,
              categories,
            },
          }));
        } catch (e) {
          setError(getError(e));
        } finally {
          setLoading(false);
        }
      }
      calculateData();
    }, [fileResolution?.rows, setError, setLoading, setValue, setData]);

    if (error || paramsData.error) {
      return <Alert severity="error">{error ? error : paramsData.error}</Alert>;
    }

    if (loading) {
      return (
        <Box m={8}>
          <Typography variant="body1" color="text.primary" mb={2}>
            <CircularProgress size={15} sx={{ mr: 2 }} /> Calculando datos...
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={4} component="form">
        <Grid item xs={12} sm={6} md={4}>
          <Grid item xs={12} mb={2}>
            <Typography color="text.primary" variant="body1">
              Parámetros Generales
            </Typography>
          </Grid>
          <GeneralParams
            errors={errors}
            register={register}
            control={control}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Grid item xs={12} mb={2}>
            <Typography color="text.primary" variant="body1">
              Parámetros de Almacenaje
            </Typography>
          </Grid>
          <StoringParams
            errors={errors}
            register={register}
            control={control}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Grid item xs={12} mb={2}>
            <Typography color="text.primary" variant="body1">
              Parámetros de Inventario
            </Typography>
          </Grid>
          <InventoryParams
            errors={errors}
            register={register}
            control={control}
          />
        </Grid>
      </Grid>
    );
  }
);

export default ParamsData;
