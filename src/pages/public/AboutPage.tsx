import { Link } from "react-router-dom";
import { useDocumentMetadata } from "src/hooks";
import { APP_NAME, CONTACT_EMAIL, ROUTES } from "src/lib/consts";

import PublicPageLayout from "./_components/PublicPageLayout";

export default function AboutPage() {
  useDocumentMetadata(
    "Acerca",
    `Qué es ${APP_NAME}, por qué existe y cómo funciona por dentro.`
  );

  return (
    <PublicPageLayout
      title={`Acerca de ${APP_NAME}`}
      description="Una plataforma de análisis de inventario que cabe en una sola pantalla."
    >
      <h2>Qué es</h2>
      <p>
        {APP_NAME} convierte un archivo Excel de inventario en un cubo
        analítico interactivo. En vez de mantener decenas de hojas, fórmulas
        y reportes, subes tu archivo una vez y obtienes un{" "}
        <strong>scorecard editable</strong>, métricas de{" "}
        <strong>rendimiento por categoría</strong>, un{" "}
        <strong>módulo de ventas</strong> sincronizado y un{" "}
        <strong>panel de data mining</strong> sobre la misma fuente de
        verdad.
      </p>

      <h2>Cómo funciona</h2>
      <ul>
        <li>
          <strong>Importas tu XLSX</strong> a través del{" "}
          <Link to={ROUTES.INVENTORY.IMPORT}>wizard de import</Link>. Validamos
          columnas y construimos el cubo en segundos.
        </li>
        <li>
          <strong>El cubo alimenta todo:</strong> dashboard de inventario,
          scorecard, performance, data mining y el módulo de ventas. Una
          sola fuente, sin reconciliaciones manuales.
        </li>
        <li>
          <strong>Editas drivers e investment types</strong> directamente
          desde el scorecard y los cálculos se recalculan en vivo.
        </li>
      </ul>

      <h2>Qué hay debajo</h2>
      <ul>
        <li>
          <strong>Frontend:</strong> React 18 + Vite + TypeScript +
          shadcn/ui + Tailwind + Recharts.
        </li>
        <li>
          <strong>Backend:</strong> Firebase Cloud Functions + Firestore +
          Storage.
        </li>
        <li>
          <strong>Auth:</strong> Firebase Auth (email + password). El acceso
          es por invitación — no hay sign-up público.
        </li>
      </ul>

      <h2>Contacto</h2>
      <p>
        ¿Querés probarlo, sugerir algo o reportar un bug?{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </PublicPageLayout>
  );
}
