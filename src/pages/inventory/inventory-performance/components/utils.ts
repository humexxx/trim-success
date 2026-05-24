/**
 * Shared axis/grid props for the inventory-performance MUI x-charts
 * wrappers. Returns an explicit object literal so call sites get
 * structural type-checking instead of `any` propagating into the
 * Recharts/MUI surface.
 */
export interface GraphProps {
  height: number;
  leftAxis: {
    tickLabelStyle: { fontSize: number; letterSpacing: number };
  };
  bottomAxis: {
    labelStyle: { fontSize: number; transform: string };
    tickLabelStyle: {
      angle: number;
      textAnchor: "middle" | "start" | "end";
      fontSize: number;
      lineHight: number;
    };
  };
  margin: { bottom: number; left: number };
  grid: { horizontal: boolean; vertical: boolean };
}

export function defaultGraphProps(
  isExpanded: boolean,
  options = {
    hasLongLeftLabels: false,
  }
): GraphProps {
  return {
    height: isExpanded ? 600 : 350,
    leftAxis: {
      tickLabelStyle: {
        fontSize: 11,
        letterSpacing: 0.2,
      },
    },
    bottomAxis: {
      labelStyle: {
        fontSize: 14,
        transform: `translateY(${
          // Hack that should be added in the lib latter.
          5 * Math.abs(Math.sin((Math.PI * 45) / 180))
        }px)`,
      },
      tickLabelStyle: {
        angle: isExpanded ? 0 : 35,
        textAnchor: isExpanded ? "middle" : "start",
        fontSize: isExpanded ? 13 : 11,
        lineHight: 2,
      },
    },
    margin: { bottom: 85, left: options.hasLongLeftLabels ? 105 : 55 },
    grid: { horizontal: true, vertical: true },
  };
}
