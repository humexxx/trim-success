import { PropsWithChildren } from "react";

const Section = ({ children }: PropsWithChildren) => {
  return <section className="py-16">{children}</section>;
};

export default Section;
