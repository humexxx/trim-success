import { Link } from "react-router-dom";

import { APP_NAME } from "src/lib/consts";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  to?: string;
}

const Logo = ({ className, to = "/" }: LogoProps) => {
  return (
    <Link
      to={to}
      className={cn("text-lg font-semibold tracking-tight", className)}
    >
      {APP_NAME}
    </Link>
  );
};

export default Logo;
