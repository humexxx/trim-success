type Props = {
  title?: string;
  description?: string;
};

const PageHeader = ({ title, description }: Props) => {
  return (
    <header className="pt-4">
      {title && (
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      )}
      {description && (
        <p className="text-base text-muted-foreground">{description}</p>
      )}
    </header>
  );
};

export default PageHeader;
