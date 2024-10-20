import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Alert, Container, Grid, Typography } from "@mui/material";
import {
  DEFAULT_GENERAL_PARAMS,
  DEFAULT_STORING_PARAMS,
  DEFAULT_INVENTORY_PARAMS,
  JSON_FILE_NAME,
} from "@shared/consts";
import { IParamsData } from "@shared/models";
import { useForm } from "react-hook-form";
import { GlobalLoader, PageHeader } from "src/components";
import { useCube } from "src/context/cube";
import { getError } from "src/utils";

import { GeneralParams, InventoryParams, StoringParams } from "./components";
import { useParamsData } from "./hooks";
import { paramsSchema } from "./schema";

const Page = () => {
  const cube = useCube();
  const { error, loading } = useParamsData();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const paramsData = cube.data?.paramsData;

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    control,
  } = useForm<Omit<IParamsData, "categories" | "drivers">>({
    resolver: yupResolver(paramsSchema),
    defaultValues: {
      generalParams: DEFAULT_GENERAL_PARAMS,
      storingParams: DEFAULT_STORING_PARAMS,
      inventoryParams: DEFAULT_INVENTORY_PARAMS,
    },
  });

  useEffect(() => {
    if (paramsData) {
      setValue("generalParams", paramsData.generalParams);
      setValue("storingParams", paramsData.storingParams);
      setValue("inventoryParams", paramsData.inventoryParams);
    }
  }, [paramsData, setValue]);

  async function _handleSubmit(
    _data: Omit<IParamsData, "categories" | "drivers">
  ) {
    setIsSubmitting(true);
    try {
      const files = await cube.getFiles();
      const jsonFile = files?.find((file) =>
        file.name.includes(JSON_FILE_NAME)
      );
      if (!jsonFile) throw new Error("No se encontro el archivo JSON");

      const generatedUID = jsonFile.name.split("-")[0].split("/")[2];
      const paramsData = { ...cube.data!.paramsData, ..._data };
      await cube.initCube(generatedUID, paramsData);
      await cube.reloadCubeData();
    } catch (error) {
      console.error(getError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {isSubmitting && <GlobalLoader />}
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
            <GeneralParams
              errors={errors}
              register={register}
              control={control}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Grid item xs={12} mb={2}>
              <Typography color="text.primary" variant="body1">
                Parametros de Almacenaje
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
                Parametros de Inventario
              </Typography>
            </Grid>
            <InventoryParams
              errors={errors}
              register={register}
              control={control}
            />
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          <Grid item xs={12} mt={2} textAlign="right">
            <LoadingButton
              loading={loading || isSubmitting}
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
