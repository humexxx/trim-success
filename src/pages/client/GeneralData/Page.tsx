import { Alert, Container, Grid, Typography } from "@mui/material";
import { GlobalLoader, PageHeader } from "src/components";
import { GeneralParams, InventoryParams, StoringParams } from "./components";
import { IDataParams } from "src/models/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { paramsSchema } from "./schema";
import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { useCube } from "src/context/cube";
import { useDataParams } from "./hooks";

const Page = () => {
  const {
    dataParams: { setData: setDataParams, data: _dataParams },
  } = useCube();
  const {
    data: dataParams,
    error,
    loading,
    updateDataParams,
  } = useDataParams({
    autoload: !_dataParams,
    initialData: _dataParams ?? null,
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
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

  useEffect(() => {
    if (dataParams) {
      setValue("generalParams", dataParams.generalParams);
      setValue("storingParams", dataParams.storingParams);
      setValue("inventoryParams", dataParams.inventoryParams);
      setValue("categories", dataParams.categories);
    }
  }, [dataParams, setValue]);

  async function _handleSubmit(data: IDataParams) {
    await updateDataParams(data);
    setDataParams(data);
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (loading && !dataParams) {
    return <GlobalLoader />;
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
          <Grid item xs={12} mt={2} textAlign="right">
            <LoadingButton
              loading={loading}
              type="submit"
              variant="contained"
              color="primary"
            >
              Guardar
            </LoadingButton>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Page;
