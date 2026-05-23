import { IColumn } from "@shared/models";

interface Props {
  columns?: IColumn[];
}

const Columns = ({ columns }: Props) => {
  return (
    <section className="p-4">
      <h2 className="mb-3 text-2xl font-semibold">Columns</h2>
      <ul className="divide-y divide-border rounded-md border">
        {columns?.map(({ name }, index) => (
          <li key={index} className="px-4 py-2 text-sm">
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Columns;
