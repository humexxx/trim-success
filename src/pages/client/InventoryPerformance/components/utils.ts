export function defaultGraphProps(
  isExpanded: boolean,
  options = {
    hasLongLeftLabels: false,
  }
) {
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
  } as any;
}
