import { ReactNode } from "react";

const PageContent = ({ children }: { children: ReactNode }) => {
  return <section className="mt-2">{children}</section>;
};

export default PageContent;
