import { ReactNode } from "react";

import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BaseProps = {
  label: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
};

type LinkProps = BaseProps & { isLink: true; to: string };
type ButtonProps = BaseProps & { isLink?: false; to?: never };
type Props = LinkProps | ButtonProps;

const CardButton = ({
  icon,
  description,
  label,
  onClick,
  loading,
  error,
  disabled,
  isLink,
  to,
}: Props) => {
  const isInactive = loading || disabled;

  const Body = (
    <Card
      className={cn(
        "relative h-full w-full transition-shadow",
        !isInactive && "cursor-pointer hover:shadow-md",
        isInactive && "opacity-60"
      )}
    >
      {loading && (
        <Loader2
          className="absolute right-4 top-4 h-5 w-5 animate-spin"
          aria-label="Cargando"
        />
      )}
      {error && (
        <span
          role="alert"
          className="absolute right-4 top-4 text-xs text-destructive"
        >
          {error}
        </span>
      )}
      <CardContent className="flex flex-col items-start gap-2 p-6 text-left">
        <div
          aria-hidden="true"
          className="rounded-md border bg-muted/30 p-2 text-foreground"
        >
          {icon}
        </div>
        <h3 className="text-base font-semibold">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  if (isLink && !disabled) {
    return <Link to={to}>{Body}</Link>;
  }

  if (!isLink && onClick && !isInactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left"
      >
        {Body}
      </button>
    );
  }

  return Body;
};

export default CardButton;
