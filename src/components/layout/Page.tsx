import { PropsWithChildren } from "react";

import { useDocumentMetadata } from "src/hooks";
import { APP_NAME } from "src/lib/consts";

import { cn } from "@/lib/utils";

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

type Props = {
  title?: string;
  description?: string;
  useContainer?: boolean;
  maxWidth?: MaxWidth;
};

const maxWidthClass: Record<MaxWidth, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

const Page = ({
  title,
  useContainer = true,
  maxWidth = "xl",
  children,
}: PropsWithChildren<Props>) => {
  useDocumentMetadata(`${title} | ${APP_NAME}`);

  if (useContainer) {
    return (
      <div className={cn("mx-auto w-full px-4", maxWidthClass[maxWidth])}>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default Page;
