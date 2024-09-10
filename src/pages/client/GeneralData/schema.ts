import { IParams } from "src/models/user";
import * as yup from "yup";

export const paramsSchema = yup.object<IParams>().shape({
  generalParams: yup.object({
    financial: yup.object({
      sales: yup.number().required(),
      salesCost: yup.number().required(),
      inventoryAnnualCost: yup.number().required(),
      companyCapitalCost: yup.number().required(),
      technologyCapitalCost: yup.number().required(),
    }),
    operational: yup.object({
      annualWorkingHours: yup.number().required(),
    }),
  }),
  storingParams: yup.object({
    manoObraCost: yup.number().required(),
    alquilerCost: yup.number().required(),
    suministroOficinaCost: yup.number().required(),
    energiaCost: yup.number().required(),
    tercerizacionCost: yup.number().required(),
    otherCosts: yup.number().required(),
  }),
  inventoryParams: yup.object({
    manoObraCost: yup.number().required(),
    insuranceCost: yup.number().required(),
    energyCost: yup.number().required(),
    officeSupplyCost: yup.number().required(),
    officeSpaceCost: yup.number().required(),
    otherCosts: yup.number().required(),
  }),
  categories: yup.array().of(yup.string().required()).required(),
});
