import { Alert, Container, Grid, Typography } from "@mui/material";
import { GlobalLoader, PageHeader } from "src/components";
import { GeneralParams, InventoryParams, StoringParams } from "./components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { paramsSchema } from "./schema";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useCube } from "src/context/cube";
import { IBaseData, ICubeData, IParamsData } from "src/models";
import { useParamsData } from "./hooks";
import {
  DEFAULT_GENERAL_PARAMS,
  DEFAULT_STORING_PARAMS,
  DEFAULT_INVENTORY_PARAMS,
} from "src/consts";
import {
  getCategoriesDataRowsAsync,
  getCategoriesDataTotals,
  getColsAndRowsAsync,
  getDriversDataRows,
} from "src/utils";
import { useBaseData } from "../DataMining/hooks";
import { httpsCallable } from "firebase/functions";
import { functions } from "src/firebase";

const Page = () => {
  const cube = useCube();
  const { error, loading, update } = useParamsData();
  const baseData = useBaseData();

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
    const paramsData = { ...cube.data!.paramsData, ..._data };

    let rows = cube.fileData?.rows;
    if (!rows) {
      const file = await cube.getFile();
      throw new Error("No file found");
      // const jsonData = await getJsonDataFromFileAsync(file!);
      const jsonData = [];
      const { rows: _rows, columns } = await getColsAndRowsAsync(jsonData);
      cube.setFileData({ rows: _rows, columns });
      rows = _rows;
    }

    const categoriesDataRows = await getCategoriesDataRowsAsync(
      rows,
      cube.data!.paramsData.drivers!
    );
    const categoriesDataTotals = getCategoriesDataTotals(
      categoriesDataRows,
      cube.data!.paramsData.drivers!
    );

    const driversFirstData = getDriversDataRows(
      cube.data!.paramsData.drivers!,
      categoriesDataRows,
      categoriesDataTotals
    );

    const _baseData: IBaseData = {
      categoriesData: {
        rows: categoriesDataRows,
        totals: categoriesDataTotals,
      },
      driversData: { rows: driversFirstData },
    };

    await baseData.update(_baseData);
    await update(paramsData);

    const createScorecardData = httpsCallable(functions, "createScorecardData");
    await createScorecardData();

    cube.setData(
      (prev) => ({ ...prev, paramsData, baseData: _baseData }) as ICubeData
    );

    setIsSubmitting(false);
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
