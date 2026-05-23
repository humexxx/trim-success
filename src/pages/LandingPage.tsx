import { MapPin, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import HeroImage from "src/assets/images/hero.webp";
import { FEATURES } from "src/consts";
import { useDocumentMetadata } from "src/hooks";
import { APP_NAME, ROUTES } from "src/lib/consts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import FeatureCard from "./public/_components/FeatureCard";
import Footer from "./public/_components/Footer";
import Section from "./public/_components/Section";

const LandingPage = () => {
  useDocumentMetadata(APP_NAME);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black">
      <header className="bg-[#1A1A1A] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            ScorChain
          </Link>
          <Link to={ROUTES.SIGN_IN}>
            <Button
              size="sm"
              className="bg-white text-[#1A1A1A] hover:bg-white/90"
            >
              Inicia sesión
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6">
        {/* Hero Section */}
        <Section>
          <h1 className="mb-8 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Maneja tu inventario con
            <br />
            ScorChain
          </h1>
          <div className="grid gap-12 lg:grid-cols-2">
            <ol className="relative space-y-8 border-l border-border pl-10">
              <li className="relative">
                <span className="absolute -left-[2.6rem] flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background ring-4 ring-background">
                  <Wrench className="h-4 w-4" />
                </span>
                <p className="text-sm">Llena el formulario</p>
                <div className="mt-4 grid gap-2">
                  <Label htmlFor="lead-email" className="sr-only">
                    Email
                  </Label>
                  <Input id="lead-email" type="email" placeholder="Email" />
                </div>
              </li>
              <li className="relative">
                <span className="absolute -left-[2.6rem] flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background ring-4 ring-background">
                  <MapPin className="h-4 w-4" />
                </span>
                <p className="text-sm">
                  Selecciona los datos adicionales de tu negocio
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="lead-business" className="sr-only">
                      Negocio
                    </Label>
                    <Input id="lead-business" placeholder="Negocio" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lead-place" className="sr-only">
                      Lugar
                    </Label>
                    <Input id="lead-place" placeholder="Lugar" />
                  </div>
                  <div>
                    <Link to={ROUTES.SIGN_IN}>
                      <Button className="bg-[#1A1A1A] hover:bg-[#2a2a2a]">
                        Enviar Consulta
                      </Button>
                    </Link>
                  </div>
                </div>
              </li>
            </ol>
            <div className="relative">
              <img
                src={HeroImage}
                alt="Trabajador de almacén en operaciones"
                className="aspect-video w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </Section>

        <Section>
          <h2 className="mb-8 text-3xl font-bold">Servicios</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {FEATURES.map(({ id, ...props }) => (
              <FeatureCard key={id} {...props} />
            ))}
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
