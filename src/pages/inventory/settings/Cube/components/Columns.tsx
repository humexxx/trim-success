import { IColumn } from "@shared/models";

interface Props {
  columns?: IColumn[];
}

const Columns = ({ columns }: Props) => {
  return (
    <section className="space-y-3">
      <header className="space-y-0.5">
        <h3 className="text-sm font-semibold tracking-tight">Columnas</h3>
        <p className="text-xs text-muted-foreground">
          Mapeo posicional de las columnas que el cubo espera del Excel.
        </p>
      </header>
      <ul className="divide-y divide-border rounded-md border bg-muted/20">
        {columns?.map(({ name }, index) => (
          <li
            key={index}
            className="flex items-center gap-3 px-4 py-2 text-sm"
          >
            <span className="font-mono text-[11px] text-muted-foreground">
              {String(index).padStart(2, "0")}
            </span>
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Columns;
