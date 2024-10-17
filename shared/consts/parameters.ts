import { EAutoCompleteParamameterType } from "@shared/enums/EAutoCompleteParamameterType";
import {
  IGeneralParamsData,
  IStoringParamsData,
  IInventoryParamsData,
} from "@shared/models";

export const DEFAULT_GENERAL_PARAMS: IGeneralParamsData = {
  financial: [
    {
      key: EAutoCompleteParamameterType.SALES,
      label: "Ventas",
      value: 0,
      type: "currency",
      autoCalculated: true,
    },
    {
      key: EAutoCompleteParamameterType.SALES_COST,
      label: "Ventas al Costo",
      value: 0,
      type: "currency",
      autoCalculated: true,
    },
    {
      key: "inventoryAnnualCost",
      label: "Costos Financiero anual del Inventario %",
      value: 12,
      type: "percentage",
    },
    {
      key: "companyCapitalCost",
      label: "Costo de Capital de la Empresa %",
      value: 12,
      type: "percentage",
    },
    {
      key: "technologyCapitalCost",
      label: "Costo de Capital de  Tecnologia Infor %",
      value: 12,
      type: "percentage",
    },
  ],
  operational: [
    {
      key: "annualWorkingHours",
      label: "Número de horas laborales anual FTE",
      value: 2296,
      type: "number",
    },
  ],
};

export const DEFAULT_STORING_PARAMS: IStoringParamsData = {
  costs: [
    {
      key: "manoObraCost",
      label: "Costo Mano de Obra",
      value: 0,
      type: "currency",
    },
    {
      key: "alquilerCost",
      label: "Alquiler de Espacio",
      value: 0,
      type: "currency",
    },
    {
      key: "suministroOficinaCost",
      label: "Costo Suministro de Oficina",
      value: 0,
      type: "currency",
    },
    {
      key: "energiaCost",
      label: "Costo de Energía",
      hint: "(Agua, luz, etc)",
      value: 0,
      type: "currency",
    },
    {
      key: "tercerizacionCost",
      label: "Tercerización",
      value: 0,
      type: "currency",
      hint: "(3PL)",
    },
    { key: "otherCosts", label: "Otros Gastos", value: 0, type: "currency" },
  ],
  investments: [
    {
      key: "terrenoEdificio",
      label: "Inversión en Terreno y Edificio",
      value: 0,
      type: "currency",
    },
    {
      key: "manejoMateriales",
      label: "Sistema de Manejo de Materiales",
      value: 0,
      hint: "(Licencias, mantenimiento, etc)",
      type: "currency",
    },
    {
      key: "almacenajeMateriales",
      label: "Sistemas de Almacenaje de Materiales",
      value: 0,
      hint: "(Racks, bandas transportadoras, etc.)",
      type: "currency",
    },
    {
      key: "administracionAlmacen",
      label: "Sistema de Administración de Almacén WMS",
      hint: "(Licencias, mantenimiento, etc)",
      type: "currency",
      value: 0,
    },
    {
      key: "otrasInversiones",
      label: "Otras Inversiones",
      value: 0,
      type: "currency",
    },
  ],
};

export const DEFAULT_INVENTORY_PARAMS: IInventoryParamsData = {
  costs: [
    {
      key: "manoObraCost",
      label: "Costo Mano de Obra",
      value: 0,
      type: "currency",
    },
    {
      key: "insuranceCost",
      label: "Seguros de Invetarios",
      value: 0,
      type: "currency",
    },
    {
      key: "energyCost",
      label: "Costo de Energía",
      hint: "(Agua, luz, etc)",
      value: 0,
      type: "currency",
    },
    {
      key: "officeSupplyCost",
      label: "Costo Suministro de Oficina",
      value: 0,
      type: "currency",
    },
    {
      key: "officeSpaceCost",
      label: "Costo de Espacio de Oficina",
      value: 0,
      type: "currency",
    },
    { key: "otherCosts", label: "Otros Gastos", value: 0, type: "currency" },
  ],
  investments: [
    {
      key: EAutoCompleteParamameterType.INVENTORY_INVESTMENT,
      label: "Inversión en Inventario",
      value: 0,
      type: "currency",
      autoCalculated: true,
    },
    {
      key: "hardwareInvestment",
      label: "Inversión en Hardware",
      value: 0,
      type: "currency",
    },
    {
      key: "managementSystemInvestment",
      label: "Inversión en Sistema de Gestión",
      value: 0,
      type: "currency",
    },
  ],
};
