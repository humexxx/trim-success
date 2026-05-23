import { PropsWithChildren } from "react";

import { useDocumentMetadata } from "src/hooks";

import { cn } from "@/lib/utils";

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

type Props = {
  /** Sets `<title>` as "{title} · {APP_NAME}". */
  title?: string;
  /** Sets `<meta name="description">` for the page. */
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
  description,
  useContainer = true,
  maxWidth = "xl",
  children,
}: PropsWithChildren<Props>) => {
  useDocumentMetadata({ title: title ?? "", description });

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
