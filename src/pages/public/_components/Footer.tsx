import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_NAME } from "src/lib/consts";

const FOOTER_COLS = [
  {
    title: "Producto",
    links: [
      { label: "Inventario", to: "/features/inventory" },
      { label: "Ventas", to: "/features/sales" },
      { label: "Data mining", to: "/features/data-mining" },
      { label: "AI insights", to: "/features/ai" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Documentación", to: "/docs" },
      { label: "Changelog", to: "/changelog" },
      { label: "Ayuda", to: "/help" },
    ],
  },
  {
    title: "Compañía",
    links: [
      { label: "Acerca", to: "/about" },
      { label: "Contacto", to: "/contact" },
      { label: "Términos", to: "/terms" },
      { label: "Privacidad", to: "/privacy" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-neutral-200/80 bg-white text-neutral-600">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-neutral-900"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-neutral-900 text-white">
                <Zap className="h-3.5 w-3.5" />
              </span>
              {APP_NAME}
            </Link>
            <p className="mt-4 max-w-xs text-sm text-neutral-500">
              Tu inventario y ventas en un solo cubo, listo para decidir.
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-neutral-500 transition-colors hover:text-neutral-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-neutral-200 pt-8 text-xs text-neutral-400 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {APP_NAME}. Todos los derechos
            reservados.
          </span>
          <div className="flex items-center gap-5">
            <Link to="/terms" className="hover:text-neutral-900">
              Términos
            </Link>
            <Link to="/privacy" className="hover:text-neutral-900">
              Privacidad
            </Link>
            <Link to="/status" className="hover:text-neutral-900">
              Estado
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
