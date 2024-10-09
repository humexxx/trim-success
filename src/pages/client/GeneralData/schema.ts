import { IParamsData, IParam } from "@shared/models";
import * as yup from "yup";

const paramSchema: yup.ObjectSchema<IParam> = yup.object({
  label: yup.string().required(),
  key: yup.string().required(),
  value: yup.number().required(),
  hint: yup.string().optional(),
  type: yup.string().oneOf(["percentage", "currency", "number"]).required(),
});

export const paramsSchema: yup.ObjectSchema<
  Omit<IParamsData, "drivers" | "categories">
> = yup.object().shape({
  generalParams: yup.object({
    financial: yup.array().of(paramSchema).required(),
    operational: yup.array().of(paramSchema).required(),
  }),
  storingParams: yup.object({
    costs: yup.array().of(paramSchema).required(),
    investments: yup.array().of(paramSchema).required(),
  }),
  inventoryParams: yup.object({
    costs: yup.array().of(paramSchema).required(),
    investments: yup.array().of(paramSchema).required(),
  }),
});
