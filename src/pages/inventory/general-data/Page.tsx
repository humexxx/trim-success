import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { JSON_FILE_NAME } from "@shared/consts";
import { EValueType } from "@shared/enums";
import { ICubeParameters } from "@shared/models";
import { roundToDecimals } from "@shared/utils";
import { useForm } from "react-hook-form";
import { GlobalLoader } from "src/components";
import { PageContent, PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";
import { getError } from "src/utils";
import { InferType } from "yup";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    defaultValues: { parameters: [] },
  });

  useEffect(() => {
    if (cubeParameters) {
      const _data = cubeParameters.parameters.map((x) => ({
        ...x,
        value:
          x.valueType === EValueType.PERCENTAGE
            ? x.value * 100
            : x.valueType === EValueType.AMOUNT
              ? roundToDecimals(x.value, 2)
              : x.value,
      }));
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
        value:
          x.valueType === EValueType.PERCENTAGE ? x.value / 100 : x.value,
      };
    });

    try {
      await update({ ...cubeParameters!, parameters: formattedData });

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
    <PageWrapper title="Datos Generales" maxWidth="2xl">
      {isSubmitting && <GlobalLoader />}
      <PageHeader
        title="Datos generales"
        description="Parámetros financieros, de almacenaje y de inventario que alimentan los cálculos del scorecard."
      />
      <form onSubmit={handleSubmit(_handleSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader className="space-y-1 pb-3">
              <CardTitle className="text-base">Generales</CardTitle>
              <CardDescription className="text-xs">
                Tasas y supuestos financieros + operacionales.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <GeneralParams
                errors={errors}
                register={register}
                control={control}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-1 pb-3">
              <CardTitle className="text-base">Almacenaje</CardTitle>
              <CardDescription className="text-xs">
                Costos de almacenamiento + inversiones en infraestructura.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <StoringParams
                errors={errors}
                register={register}
                control={control}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-1 pb-3">
              <CardTitle className="text-base">Inventario</CardTitle>
              <CardDescription className="text-xs">
                Costos asociados al inventario + capital invertido.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <InventoryParams
                errors={errors}
                register={register}
                control={control}
              />
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end border-t pt-4">
          <Button type="submit" loading={loading || isSubmitting}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </PageWrapper>
  );
};

export default Page;
