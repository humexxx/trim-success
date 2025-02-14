import { useRef } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import {
  TextField,
  List as MuiList,
  ListItem,
  Box,
  Grid,
  Typography,
  Container,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from "@mui/material";
import { IColumn } from "@shared/models";
import { Controller, useForm } from "react-hook-form";
import { AdminContent } from "src/components";
import * as yup from "yup";


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
  const input = useRef<HTMLDivElement>(null);
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

  const onSubmit = (data: {
    name: string;
    code: string;
    indexType: string;
    index?: number;
    indexStart?: number;
    indexEnd?: number;
  }) => {
    const _index =
      data.indexType === "unique"
        ? data.index
        : Array.from(
            { length: data.indexEnd! - data.indexStart! + 1 },
            (_, i) => data.indexStart! + i
          );

    reset();
    const _data = { name: data.name, code: data.code, index: _index! };
    input.current?.focus();
  };

  return (
    <AdminContent>
      <Container
        maxWidth="md"
        sx={{ marginLeft: 0, paddingLeft: "0 !important" }}
      >
        <Typography variant="h4" gutterBottom>
          Columnas
        </Typography>
        <Box>
          <MuiList>
            {columns?.map(({ code, index, name, indexRange }, idx) => (
              <ListItem key={code} sx={{ paddingLeft: 0, display: "flex" }}>
                <TextField
                  label="Nombre"
                  value={name}
                  sx={{ flex: 1, marginRight: 2 }}
                />
                <TextField
                  label="Código"
                  value={code}
                  sx={{ flex: 1, marginRight: 2 }}
                  disabled
                />
                <TextField
                  label="Índice"
                  value={index ? index.toString() : indexRange?.toString()}
                  sx={{ flex: 1, marginRight: 2 }}
                />
                <IconButton aria-label="delete" disabled>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </MuiList>

          <Grid
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            container
            spacing={2}
            mt={4}
            autoComplete="off"
          >
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                inputRef={input}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Código"
                {...register("code")}
                error={!!errors.code}
                helperText={errors.code?.message}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                rules={{ required: true }}
                control={control}
                name="indexType"
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel
                      value="unique"
                      control={<Radio />}
                      label="Único"
                    />
                    <FormControlLabel
                      value="range"
                      control={<Radio />}
                      label="Rango"
                    />
                  </RadioGroup>
                )}
              />
            </Grid>

            {indexType === "unique" && (
              <Grid item xs={12}>
                <TextField
                  type="number"
                  label="Índice"
                  {...register("index")}
                  error={!!errors.index}
                  helperText={errors.index?.message}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
            )}
            {indexType === "range" && (
              <>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    label="Índice Inicio"
                    {...register("indexStart")}
                    error={!!errors.indexStart}
                    helperText={errors.indexStart?.message}
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    label="Índice Fin"
                    {...register("indexEnd")}
                    error={!!errors.indexEnd}
                    helperText={errors.indexEnd?.message}
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </>
            )}

            <Grid item minHeight="100%" display="flex" alignItems="end">
              <LoadingButton
                type="submit"
                variant="contained"
                sx={{ mb: 3 }}
                startIcon={<AddIcon />}
                disabled
              >
                Agregar
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </AdminContent>
  );
};

export default AdminColumns;
