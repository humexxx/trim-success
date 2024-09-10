import { Alert, Container, Grid, Typography } from "@mui/material";
import { PageHeader } from "src/components";
import { GeneralParams, InventoryParams, StoringParams } from "./components";
import { IParams } from "src/models/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { paramsSchema } from "./schema";
import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { useCube } from "src/context/cube";

const Page = () => {
  const {
    dataParams: { data: params, loading, error, updateDataParams },
  } = useCube();
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm<IParams>({
    resolver: yupResolver(paramsSchema),
    defaultValues: {
      generalParams: {
        financial: {
          sales: 0,
          salesCost: 0,
          inventoryAnnualCost: 0,
          companyCapitalCost: 0,
          technologyCapitalCost: 0,
        },
        operational: {
          annualWorkingHours: 0,
        },
      },
      storingParams: {
        manoObraCost: 0,
        alquilerCost: 0,
        suministroOficinaCost: 0,
        energiaCost: 0,
        tercerizacionCost: 0,
        otherCosts: 0,
      },
      inventoryParams: {
        manoObraCost: 0,
        insuranceCost: 0,
        energyCost: 0,
        officeSupplyCost: 0,
        officeSpaceCost: 0,
        otherCosts: 0,
      },
      categories: [],
    },
  });

  useEffect(() => {
    if (params) {
      setValue("generalParams", params.generalParams);
      setValue("storingParams", params.storingParams);
      setValue("inventoryParams", params.inventoryParams);
      setValue("categories", params.categories);
    }
  }, [params, setValue]);

  async function _handleSubmit(data: IParams) {
    updateDataParams(data);
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <PageHeader title="Datos Generales" />
      <Container
        sx={{ marginLeft: 0 }}
        component="form"
        onSubmit={handleSubmit(_handleSubmit)}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Grid item xs={12}>
              <Typography color="text.primary" variant="h6">
                Parámetros Generales
              </Typography>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Alert severity="info">
                Estos son los parámetros generales de la empresa.
              </Alert>
            </Grid>
            <GeneralParams errors={errors} register={register} />
          </Grid>
          <Grid item xs={0} md={6} />
          <Grid item xs={12} md={6}>
            <Grid item xs={12}>
              <Typography color="text.primary" variant="h6">
                Parámetros Almacenaje
              </Typography>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Alert severity="info">
                Estos valores son utilizados para calcular el costo de
                almacenamiento.
              </Alert>
            </Grid>
            <StoringParams errors={errors} register={register} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid item xs={12}>
              <Typography color="text.primary" variant="h6">
                Parámetros Inventario
              </Typography>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Alert severity="info">
                Estos valores son utilizados para calcular el costo de
                inventario.
              </Alert>
            </Grid>
            <InventoryParams errors={errors} register={register} />
          </Grid>
          <Grid item xs={12} mt={2} textAlign="right">
            <LoadingButton type="submit" loading={loading} variant="contained">
              Guardar
            </LoadingButton>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Page;
