import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { ICubeData, IDriver, IParamsData } from "@shared/models";
import { DEFAULT_DRIVERS } from "@shared/consts";
import { useCube } from "src/context/cube";
import { useEffect } from "react";

function not(a: readonly IDriver[], b: readonly IDriver[]) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a: readonly IDriver[], b: readonly IDriver[]) {
  return a.filter((value) => b.includes(value));
}

function union(a: readonly IDriver[], b: readonly IDriver[]) {
  return [...a, ...not(b, a)];
}

export default function DriversStep() {
  const cube = useCube();

  const [checked, setChecked] = React.useState<readonly IDriver[]>([]);
  const [left, setLeft] = React.useState<readonly IDriver[]>([]);
  const right = cube.data?.paramsData?.drivers || [];
  const setRight = (value: readonly IDriver[]) =>
    cube.setData({
      paramsData: { drivers: value } as IParamsData,
    } as ICubeData);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: IDriver) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const driverOfChecked = (items: readonly IDriver[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly IDriver[]) => () => {
    if (driverOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  useEffect(() => {
    cube.setData({
      paramsData: {
        drivers: DEFAULT_DRIVERS.filter(
          (x) => x.key !== "PLANNERS" && x.key !== "ORDERS"
        ),
      } as IParamsData,
    } as ICubeData);
    setLeft(
      DEFAULT_DRIVERS.filter((x) => x.key === "PLANNERS" || x.key === "ORDERS")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customList = (title: React.ReactNode, items: readonly IDriver[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              driverOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              driverOfChecked(items) !== items.length &&
              driverOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${driverOfChecked(items)}/${items.length} seleccionados`}
      />
      <Divider />
      <List
        sx={{
          width: 250,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: IDriver) => {
          const labelId = `transfer-list-all-item-${value.key}-label`;

          return (
            <ListItemButton
              key={value.key}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2}>
      <Grid item>{customList("Opciones", left)}</Grid>
      <Grid item>
        <Grid container direction="column" sx={{ alignItems: "center" }}>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList("Drivers Incluidos", right)}</Grid>
    </Grid>
  );
}
