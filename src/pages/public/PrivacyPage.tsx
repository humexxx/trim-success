import { useDocumentMetadata } from "src/hooks";
import { APP_NAME, CONTACT_EMAIL } from "src/lib/consts";

import PublicPageLayout from "./_components/PublicPageLayout";

export default function PrivacyPage() {
  useDocumentMetadata(
    "Privacidad",
    `Qué datos guarda ${APP_NAME}, dónde y por cuánto tiempo.`
  );

  return (
    <PublicPageLayout
      title="Política de privacidad"
      description="Qué datos recogemos, dónde viven y para qué los usamos. Versión corta."
      meta="Última actualización: mayo 2026"
    >
      <h2>Qué datos recogemos</h2>
      <ul>
        <li>
          <strong>Datos de cuenta:</strong> tu email y un identificador
          único interno, gestionados por Firebase Authentication.
        </li>
        <li>
          <strong>Datos de inventario:</strong> los archivos XLSX que
          subes y el cubo resultante (parámetros, scorecard, métricas).
          Viven en Firestore + Cloud Storage de tu organización.
        </li>
        <li>
          <strong>Telemetría mínima:</strong> logs operativos de las
          Cloud Functions (errores, tiempos de ejecución) — sin
          contenido de tus datos de negocio.
        </li>
      </ul>

      <h2>Qué NO recogemos</h2>
      <ul>
        <li>
          No usamos cookies de terceros, píxeles publicitarios, analytics
          de tracking ni heatmaps.
        </li>
        <li>
          No vendemos, alquilamos ni compartimos tu información con
          terceros para fines comerciales.
        </li>
        <li>
          No entrenamos modelos de IA con tus datos. Cuando usas el
          asistente IA dentro de la plataforma, sólo se envía la
          pregunta que escribiste — no tu cubo completo.
        </li>
      </ul>

      <h2>Dónde viven tus datos</h2>
      <p>
        Toda la infraestructura corre sobre <strong>Google Cloud</strong>{" "}
        (Firebase Auth, Firestore, Cloud Storage, Cloud Functions). El
        almacenamiento está encriptado en reposo y todas las
        comunicaciones usan TLS.
      </p>

      <h2>Cuánto tiempo los guardamos</h2>
      <ul>
        <li>
          Mientras tu cuenta esté activa, conservamos tus datos para que
          la plataforma siga funcionando.
        </li>
        <li>
          Si das de baja tu cuenta o lo solicitas explícitamente,
          eliminamos tu cubo y archivos en un plazo razonable.
        </li>
      </ul>

      <h2>Tus derechos</h2>
      <p>
        Podés solicitarnos en cualquier momento el acceso, exportación o
        eliminación de tus datos escribiendo a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </PublicPageLayout>
  );
}
