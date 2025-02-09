import { ReactNode } from "react";

import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Card, CardContent, Grid, IconButton } from "@mui/material";

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
      <Card elevation={3} sx={{ borderRadius: 4 }}>
        <CardContent>
          <IconButton
            sx={{ position: "absolute", right: 8, zIndex: 1 }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
          </IconButton>
          {children}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default GraphContainer;
