import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-16 bg-[#1A1A1A] py-12 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-12">
          <div className="text-lg font-semibold tracking-tight">ScorChain</div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Compañía</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <Link to="/about" className="hover:text-white">
                    Acerca de nosotros
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Servicios</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <Link to="/features/inventory" className="hover:text-white">
                    Inventario
                  </Link>
                </li>
                <li>
                  <Link to="/features/sales" className="hover:text-white">
                    Ventas
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-white/80">
            <span>Socials</span>
            <Link to="/help" className="hover:text-white">
              Ayuda
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
