import { useRef } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { IColumn } from "@shared/models";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { AdminContent } from "src/components";
import * as yup from "yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const schema = yup.object().shape({
  code: yup.string().required("Code is required"),
  name: yup.string().required("Name is required"),
  indexType: yup
    .string()
    .oneOf(["unique", "range"])
    .required("Index type is required"),

  index: yup
    .number()
    .when("indexType", {
      is: "unique",
      then: (schema) =>
        schema
          .required("Index is required")
          .min(0, "Index must be 0 or greater"),
      otherwise: (schema) => schema.notRequired(),
    })
    .test("unique-index", "Index is duplicated", function () {
      const { indexType, index, indexStart, indexEnd } = this.parent;
      const indices =
        indexType === "range"
          ? Array.from(
              { length: indexEnd - indexStart + 1 },
              (_, i) => indexStart + i
            )
          : [index];
      const existingIndices = this.options.context?.columns
        ?.map((col: IColumn) => col.index)
        .flat();
      return indices.every((idx) => !existingIndices.includes(idx));
    }),

  indexStart: yup.number().when("indexType", {
    is: "range",
    then: (schema) =>
      schema
        .required("Start index is required")
        .min(0, "Start index must be 0 or greater"),
    otherwise: (schema) => schema.notRequired(),
  }),

  indexEnd: yup.number().when("indexType", {
    is: "range",
    then: (schema) =>
      schema
        .required("End index is required")
        .min(
          yup.ref("indexStart"),
          "End index must be greater than start index"
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

interface Props {
  columns?: IColumn[];
}

const AdminColumns = ({ columns }: Props) => {
  const input = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema, { context: { columns } }),
    defaultValues: {
      name: "",
      code: "",
      indexType: "unique",
      index: 0,
      indexStart: 0,
      indexEnd: 0,
    },
  });

  const indexType = watch("indexType", "unique");

  const onSubmit = () => {
    // Add column is intentionally disabled at the UI level; this preserves
    // the form wiring so future writes only need to flip the button + ship a
    // mutation hook.
    reset();
    input.current?.focus();
  };

  return (
    <AdminContent>
      <div className="max-w-3xl">
        <h2 className="mb-4 text-2xl font-semibold">Columnas</h2>

        <ul className="space-y-3">
          {columns?.map(({ code, index, name, indexRange }) => (
            <li key={code} className="grid grid-cols-12 items-end gap-3">
              <div className="col-span-4 space-y-1.5">
                <Label>Nombre</Label>
                <Input value={name} readOnly />
              </div>
              <div className="col-span-3 space-y-1.5">
                <Label>Código</Label>
                <Input value={code} disabled />
              </div>
              <div className="col-span-4 space-y-1.5">
                <Label>Índice</Label>
                <Input
                  value={index ? index.toString() : indexRange?.toString()}
                  readOnly
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled
                aria-label="Eliminar columna"
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-4"
          autoComplete="off"
        >
          <div className="space-y-1.5">
            <Label htmlFor="admin-col-name">Nombre</Label>
            <Input id="admin-col-name" {...register("name")} ref={input} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="admin-col-code">Código</Label>
            <Input id="admin-col-code" {...register("code")} disabled />
            {errors.code && (
              <p className="text-xs text-destructive">{errors.code.message}</p>
            )}
          </div>

          <Controller
            control={control}
            name="indexType"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="unique" id="rg-unique" />
                  <Label htmlFor="rg-unique" className="font-normal">
                    Único
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="range" id="rg-range" />
                  <Label htmlFor="rg-range" className="font-normal">
                    Rango
                  </Label>
                </div>
              </RadioGroup>
            )}
          />

          {indexType === "unique" && (
            <div className="space-y-1.5">
              <Label htmlFor="admin-col-index">Índice</Label>
              <Input
                id="admin-col-index"
                type="number"
                min={0}
                {...register("index")}
              />
              {errors.index && (
                <p className="text-xs text-destructive">
                  {errors.index.message}
                </p>
              )}
            </div>
          )}

          {indexType === "range" && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-col-start">Índice Inicio</Label>
                <Input
                  id="admin-col-start"
                  type="number"
                  min={0}
                  {...register("indexStart")}
                />
                {errors.indexStart && (
                  <p className="text-xs text-destructive">
                    {errors.indexStart.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admin-col-end">Índice Fin</Label>
                <Input
                  id="admin-col-end"
                  type="number"
                  min={0}
                  {...register("indexEnd")}
                />
                {errors.indexEnd && (
                  <p className="text-xs text-destructive">
                    {errors.indexEnd.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <Button type="submit" disabled>
            <Plus />
            Agregar
          </Button>
        </form>
      </div>
    </AdminContent>
  );
};

export default AdminColumns;
