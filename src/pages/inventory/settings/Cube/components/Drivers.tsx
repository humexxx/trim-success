import { IDriver } from "@shared/models";

interface Props {
  drivers?: IDriver[];
}

const Drivers = ({ drivers }: Props) => {
  return (
    <section className="p-4">
      <h2 className="mb-3 text-2xl font-semibold">Drivers</h2>
      <ul className="divide-y divide-border rounded-md border">
        {drivers?.map((driver, index) => (
          <li key={index} className="px-4 py-2 text-sm">
            {driver.label}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Drivers;
