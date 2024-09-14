import { IDataParams } from "src/models/user";
import * as yup from "yup";

export const paramsSchema = yup.object<IDataParams>().shape({
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
    costs: yup.object({
      manoObraCost: yup.number().required(),
      alquilerCost: yup.number().required(),
      suministroOficinaCost: yup.number().required(),
      energiaCost: yup.number().required(),
      tercerizacionCost: yup.number().required(),
      otherCosts: yup.number().required(),
    }),
    investments: yup.object({
      terrenoEdificio: yup.number().required(),
      manejoMateriales: yup.number().required(),
      almacenajeMateriales: yup.number().required(),
      administracionAlmacen: yup.number().required(),
      otrasInversiones: yup.number().required(),
    }),
  }),
  inventoryParams: yup.object({
    costs: yup.object({
      manoObraCost: yup.number().required(),
      insuranceCost: yup.number().required(),
      energyCost: yup.number().required(),
      officeSupplyCost: yup.number().required(),
      officeSpaceCost: yup.number().required(),
      otherCosts: yup.number().required(),
    }),
    investments: yup.object({
      hardwareInvestment: yup.number().required(),
      inventoryInvestment: yup.number().required(),
      managementSystemInvestment: yup.number().required(),
    }),
  }),
  categories: yup.array().of(yup.string().required()).required(),
});
