import {
  EDataModelParameterSubType,
  EDataModelParameterType,
  EValueType,
} from "@shared/enums";
import { ICubeParameters, IParameter } from "@shared/models";
import * as yup from "yup";

const paramSchema: yup.ObjectSchema<IParameter> = yup.object({
  name: yup.string().required(),
  description: yup.string().optional(),
  valueType: yup.string().oneOf(Object.values(EValueType)).required(),
  value: yup.number().required(),
  type: yup.string().oneOf(Object.values(EDataModelParameterType)).required(),
  subType: yup
    .string()
    .oneOf(Object.values(EDataModelParameterSubType))
    .required(),
  autoCalculated: yup.boolean().optional(),
});

export const parametersScheme: yup.ObjectSchema<
  Omit<ICubeParameters, "drivers" | "categories">
> = yup.object({
  parameters: yup.array().of(paramSchema).ensure().required(),
});
