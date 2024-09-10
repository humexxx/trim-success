import { useEffect } from "react";
import { useCube } from "src/context/cube";
import { Grid } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { IParams } from "src/models/user";
import {
  paramsSchema,
  GeneralParams,
  StoringParams,
  InventoryParams,
} from "../../GeneralData";
import { LoadingButton } from "@mui/lab";

interface Props {
  error: string;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

const GeneralParameters = ({ error, loading, setError, setLoading }: Props) => {
  const {
    dataParams: { data: params, updateMemoryDataParams },
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
          inventoryAnnualCost: 12,
          companyCapitalCost: 12,
          technologyCapitalCost: 12,
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

  function _handleSubmit(data: IParams) {
    updateMemoryDataParams(data);
  }

  useEffect(() => {
    if (params) {
      setValue("generalParams", params.generalParams);
      setValue("storingParams", params.storingParams);
      setValue("inventoryParams", params.inventoryParams);
      setValue("categories", params.categories);
    }
  }, [params, setValue]);

  return (
    <Grid
      container
      spacing={4}
      component="form"
      onSubmit={handleSubmit(_handleSubmit)}
    >
      <Grid item xs={12} sm={6} md={4}>
        <GeneralParams errors={errors} register={register} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StoringParams errors={errors} register={register} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <InventoryParams errors={errors} register={register} />
      </Grid>
      <Grid item xs={12} mt={2} textAlign="right">
        <LoadingButton type="submit" loading={loading} variant="contained">
          Guardar
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default GeneralParameters;
