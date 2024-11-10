import { IBaseData, IScorecardData, ICubeParameters } from "@shared/models";

export function updateStoringScorecardDataRow(
  newRow: IScorecardData["storingCosts"]["rows"][number],
  rows: IScorecardData["storingCosts"]["rows"],
  paramsData: ICubeParameters,
  catData: IBaseData
): IScorecardData["storingCosts"] {
  const storingCosts = rows.map((r) => {
    if (r.cost === newRow.cost) {
      return {
        ...newRow,
        ...paramsData.categories.reduce((acc, category) => {
          acc[category] =
            newRow.total *
            Number(
              catData.driversData.rows.find(
                (row) =>
                  row.driver ===
                  paramsData.drivers.find(
                    (driver) => driver.key === newRow.driver
                  )?.label
              )![category]
            );
          return acc;
        }, {} as any),
      };
    }
    return r;
  });

  const totalStoringCost = storingCosts.reduce((acc, row) => {
    return acc + Number(row.total);
  }, 0);
  storingCosts.forEach((row) => {
    row.totalPercentage = Number(row.total) / totalStoringCost;
  });

  return {
    rows: storingCosts,
    totals: {
      total: storingCosts.reduce((acc, row) => acc + Number(row.total), 0),
      totalPercentage: 1,
      ...paramsData.categories.reduce((acc, category) => {
        acc[category] = storingCosts.reduce(
          (acc, row) => acc + Number(row[category]),
          0
        );
        return acc;
      }, {} as any),
    },
  };
}

export function updateInventoryScorecardDataRow(
  newRow: IScorecardData["inventoryCosts"]["rows"][number],
  rows: IScorecardData["inventoryCosts"]["rows"],
  cubeParameters: ICubeParameters,
  catData: IBaseData
): IScorecardData["inventoryCosts"] {
  const inventoryCosts = rows.map((r) => {
    if (r.cost === newRow.cost) {
      return {
        ...newRow,
        ...cubeParameters.categories.reduce((acc, category) => {
          acc[category] =
            newRow.total *
            Number(
              catData.driversData.rows.find(
                (row) =>
                  row.driver ===
                  cubeParameters.drivers.find(
                    (driver) => driver.key === newRow.driver
                  )?.label
              )![category]
            );
          return acc;
        }, {} as any),
      };
    }
    return r;
  });

  const totalStoringCost = inventoryCosts.reduce((acc, row) => {
    return acc + Number(row.total);
  }, 0);
  inventoryCosts.forEach((row) => {
    row.totalPercentage = row.total / totalStoringCost;
  });

  return {
    rows: inventoryCosts,
    totals: {
      total: inventoryCosts.reduce((acc, row) => acc + Number(row.total), 0),
      totalPercentage: 1,
      ...cubeParameters.categories.reduce((acc, category) => {
        acc[category] = inventoryCosts.reduce(
          (acc, row) => acc + Number(row[category]),
          0
        );
        return acc;
      }, {} as any),
    },
  };
}
