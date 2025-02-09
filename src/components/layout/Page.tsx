import { PropsWithChildren } from "react";

import { Breakpoint, Container } from "@mui/material";
import { useDocumentMetadata } from "src/hooks";
import { APP_NAME } from "src/lib/consts";

type Props = {
  title?: string;
  description?: string;
  useContainer?: boolean;
  maxWidth?: false | Breakpoint | undefined;
};

const Page = ({
  title,
  useContainer = true,
  maxWidth = "xl",
  children,
}: PropsWithChildren<Props>) => {
  useDocumentMetadata(`${title} | ${APP_NAME}`);

  if (useContainer) {
    return <Container maxWidth={maxWidth}>{children}</Container>;
  }

  return children;
};

export default Page;
