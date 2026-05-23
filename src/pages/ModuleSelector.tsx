import { Boxes, Tags } from "lucide-react";
import { CardButton } from "src/components";
import { PageHeader } from "src/components/layout";
import { ROUTES } from "src/lib/consts";

const ModuleSelector = () => {
  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="mt-4 flex flex-col gap-6">
        <PageHeader title="Seleccionar Módulo" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CardButton
            icon={<Boxes className="h-5 w-5 text-muted-foreground" />}
            label="Inventario"
            description="Manejar los datos de inventario."
            isLink
            to={ROUTES.INVENTORY.DASHBOARD}
          />
          <CardButton
            icon={<Tags className="h-5 w-5 text-muted-foreground" />}
            label="Ventas"
            description="Manejar los datos de ventas."
            disabled
            isLink
            to={ROUTES.SALES}
          />
        </div>
      </div>
    </div>
  );
};

export default ModuleSelector;
