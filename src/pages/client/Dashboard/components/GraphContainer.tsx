import { ReactNode } from "react";

import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Grid, IconButton } from "@mui/material";

const GraphContainer = ({
  isExpanded,
  setIsExpanded,
  children,
}: {
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  children: ReactNode;
}) => {
  return (
    <Grid
      item
      xs={12}
      md={isExpanded ? 12 : 6}
      xl={isExpanded ? 12 : 4}
      sx={{ position: "relative", mb: isExpanded ? 4 : 0 }}
    >
      <IconButton
        sx={{ position: "absolute", right: 0, zIndex: 1 }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
      </IconButton>
      {children}
    </Grid>
  );
};

export default GraphContainer;
