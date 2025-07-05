import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" style={{ textDecoration: "none", color: "white" }}>
      <Typography variant="h6" component="span">
        ScorChain
      </Typography>
    </Link>
  );
};

export default Logo;
