import { IDriver } from "@shared/models";

interface Props {
  drivers?: IDriver[];
}

const Drivers = ({ drivers }: Props) => {
  return (
    <section className="space-y-3">
      <header className="space-y-0.5">
        <h3 className="text-sm font-semibold tracking-tight">Drivers</h3>
        <p className="text-xs text-muted-foreground">
          Métricas de negocio que el cubo agrega y muestra por categoría.
        </p>
      </header>
      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {drivers?.map((driver, index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2 text-sm"
          >
            <span>{driver.label}</span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {driver.key}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Drivers;
