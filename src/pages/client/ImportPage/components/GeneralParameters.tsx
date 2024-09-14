import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useCube } from "src/context/cube";
import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { IDataParams } from "src/models/user";
import {
  paramsSchema,
  GeneralParams,
  StoringParams,
  InventoryParams,
} from "../../GeneralData";
import { getGeneralDataAsync } from "src/utils";

interface Props {
  error: string;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

const GeneralParameters = forwardRef(
  ({ error, loading, setError, setLoading }: Props, ref) => {
    const {
      fileResolution,
      dataParams: { setData: setDataParams },
    } = useCube();

    const {
      formState: { errors },
      register,
      setValue,
      getValues,
    } = useForm<IDataParams>({
      resolver: yupResolver(paramsSchema),
      defaultValues: {
        generalParams: {
          financial: {
            sales: 0,
            salesCost: 0,
            inventoryAnnualCost: 12,
            companyCapitalCost: 12,
            technologyCapitalCost: 12,
          },
          operational: {
            annualWorkingHours: 0,
          },
        },
        storingParams: {
          costs: {
            manoObraCost: 0,
            alquilerCost: 0,
            suministroOficinaCost: 0,
            energiaCost: 0,
            tercerizacionCost: 0,
            otherCosts: 0,
          },
          investments: {
            terrenoEdificio: 0,
            manejoMateriales: 0,
            almacenajeMateriales: 0,
            administracionAlmacen: 0,
            otrasInversiones: 0,
          },
        },
        inventoryParams: {
          costs: {
            manoObraCost: 0,
            insuranceCost: 0,
            energyCost: 0,
            officeSupplyCost: 0,
            officeSpaceCost: 0,
            otherCosts: 0,
          },
          investments: {
            hardwareInvestment: 0,
            inventoryInvestment: 0,
            managementSystemInvestment: 0,
          },
        },
        categories: [],
      },
    });

    useImperativeHandle(ref, () => ({
      saveData: () => {
        setDataParams({
          generalParams: {
            ...getValues("generalParams"),
          },
          storingParams: {
            ...getValues("storingParams"),
          },
          inventoryParams: {
            ...getValues("inventoryParams"),
          },
          categories: getValues("categories"),
        });
      },
    }));

    useEffect(() => {
      async function calculateData() {
        setLoading(true);
        try {
          const { sumCostSales, sumSales, categories } =
            await getGeneralDataAsync(fileResolution?.rows);
          setValue("generalParams", {
            financial: {
              sales: sumSales,
              salesCost: sumCostSales,
              inventoryAnnualCost: 12,
              companyCapitalCost: 12,
              technologyCapitalCost: 12,
            },
            operational: {
              annualWorkingHours: 0,
            },
          });
          setValue("categories", categories);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
      calculateData();
    }, [fileResolution?.rows, setError, setLoading, setValue]);

    if (error) {
      return <Alert severity="error">{error}</Alert>;
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
              Parametros Generales
            </Typography>
          </Grid>
          <GeneralParams errors={errors} register={register} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Grid item xs={12} mb={2}>
            <Typography color="text.primary" variant="body1">
              Parametros de Almacenaje
            </Typography>
          </Grid>
          <StoringParams errors={errors} register={register} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Grid item xs={12} mb={2}>
            <Typography color="text.primary" variant="body1">
              Parametros de Inventario
            </Typography>
          </Grid>
          <InventoryParams errors={errors} register={register} />
        </Grid>
      </Grid>
    );
  }
);

export default GeneralParameters;
