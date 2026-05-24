import { ReactNode } from "react";

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface IFeature {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  link: string;
}

const FeatureCard = ({
  title,
  description,
  icon,
  link,
}: Omit<IFeature, "id">) => {
  return (
    <Link
      to={link}
      aria-label={`Ir a ${title}`}
      className="block h-full transition-transform hover:-translate-y-0.5"
    >
      <Card className="flex h-full flex-col border-2 transition-shadow hover:shadow-md">
        <CardContent className="flex flex-1 flex-col justify-between gap-6 p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {icon}
              <h4 className="text-base font-medium">{title}</h4>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button size="sm" className="self-start">
            Ver detalles
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeatureCard;
