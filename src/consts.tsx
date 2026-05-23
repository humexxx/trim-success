import { BarChart3, Lock, Package, ShoppingCart, Truck } from "lucide-react";

import { IFeature } from "./pages/public/_components/FeatureCard";

export const FEATURES: IFeature[] = [
  {
    id: "1",
    title: "Inventario",
    description:
      "Maneja tu inventario de manera eficiente y sin complicaciones.",
    icon: <Truck className="h-5 w-5 text-muted-foreground" />,
    link: "/features/inventory",
  },
  {
    id: "2",
    title: "Productos",
    description:
      "Gestiona tus productos y mantén un control total sobre ellos.",
    icon: <Package className="h-5 w-5 text-muted-foreground" />,
    link: "/features/products",
  },
  {
    id: "3",
    title: "Reportes",
    description:
      "Genera reportes detallados para tomar decisiones informadas.",
    icon: <BarChart3 className="h-5 w-5 text-muted-foreground" />,
    link: "/features/reports",
  },
  {
    id: "4",
    title: "Seguridad",
    description: "Mantén la seguridad de tus datos y protege tu información.",
    icon: <Lock className="h-5 w-5 text-muted-foreground" />,
    link: "/features/security",
  },
  {
    id: "5",
    title: "Ventas",
    description:
      "Gestiona tus ventas de manera eficiente y sin complicaciones.",
    icon: <ShoppingCart className="h-5 w-5 text-muted-foreground" />,
    link: "/features/sales",
  },
];
