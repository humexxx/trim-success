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
    <PageWrapper title="Datos Generales">
      {isSubmitting && <GlobalLoader />}
      <PageHeader title="Datos Generales" />
      <PageContent>
        <form
          onSubmit={handleSubmit(_handleSubmit)}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          <div>
            <p className="mb-2 text-sm font-medium">Parametros Generales</p>
            <GeneralParams
              errors={errors}
              register={register}
              control={control}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Parametros de Almacenaje</p>
            <StoringParams
              errors={errors}
              register={register}
              control={control}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Parametros de Inventario</p>
            <InventoryParams
              errors={errors}
              register={register}
              control={control}
            />
          </div>
          {error && (
            <div className="md:col-span-3">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          <div className="mt-2 text-right md:col-span-3">
            <Button type="submit" loading={loading || isSubmitting}>
              Guardar
            </Button>
          </div>
        </form>
      </PageContent>
    </PageWrapper>
  );
};

export default Page;
