import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Alert, Grid, Typography } from "@mui/material";
import { JSON_FILE_NAME } from "@shared/consts";
import { EValueType } from "@shared/enums";
import { ICubeParameters } from "@shared/models";
import { roundToDecimals } from "@shared/utils";
import { useForm } from "react-hook-form";
import { GlobalLoader } from "src/components";
import { PageContent, PageHeader } from "src/components/layout";
import { useCube } from "src/context/hooks";
import { getError } from "src/utils";
import { InferType } from "yup";

import { GeneralParams, InventoryParams, StoringParams } from "./components";
import { useParamsData } from "./hooks";
import { parametersScheme } from "./schema";

const Page = () => {
  const cube = useCube();
  const cubeParameters = cube.data?.cubeParameters;

  const { error, loading, update } = useParamsData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    control,
  } = useForm<InferType<typeof parametersScheme>>({
    resolver: yupResolver(parametersScheme),
    defaultValues: {
      parameters: [],
    },
  });

  useEffect(() => {
    if (cubeParameters) {
      const _data = cubeParameters.parameters.map((x) => {
        return {
          ...x,
          value:
            x.valueType === EValueType.PERCENTAGE
              ? x.value * 100
              : x.valueType === EValueType.AMOUNT
                ? roundToDecimals(x.value, 2)
                : x.value,
        };
      });
      setValue("parameters", _data);
    }
  }, [cubeParameters, setValue]);

  async function _handleSubmit(
    _data: Omit<ICubeParameters, "categories" | "drivers">
  ) {
    setIsSubmitting(true);

    const formattedData = [
      ...cubeParameters!.parameters.filter((x) => x.autoCalculated),
      ..._data.parameters,
    ].map((x) => {
      if (x.autoCalculated) return x;
      return {
        ...x,
        value: x.valueType === EValueType.PERCENTAGE ? x.value / 100 : x.value,
      };
    });

    try {
      await update({
        ...cubeParameters!,
        parameters: formattedData,
      });

      const files = await cube.getFiles();
      const jsonFile = files?.find((file) =>
        file.name.includes(JSON_FILE_NAME)
      );
      if (!jsonFile) throw new Error("No se encontro el archivo JSON");

      const generatedUID = jsonFile.name.split("-")[0];
      await cube.initCube(generatedUID, cubeParameters?.drivers ?? []);
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
      <PageContent>
        <Grid
          component="form"
          onSubmit={handleSubmit(_handleSubmit)}
          onInvalid={console.log}
          container
          spacing={4}
        >
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
      </PageContent>
    </>
  );
};

export default Page;
