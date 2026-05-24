import { useDocumentMetadata } from "src/hooks";
import { APP_NAME, CONTACT_EMAIL } from "src/lib/consts";

import PublicPageLayout from "./_components/PublicPageLayout";

export default function TermsPage() {
  useDocumentMetadata(
    "Términos de uso",
    `Términos honestos de uso de ${APP_NAME}.`
  );

  return (
    <PublicPageLayout
      title="Términos de uso"
      description="Versión corta y honesta. Si algo no te queda claro, escríbenos."
      meta="Última actualización: mayo 2026"
    >
      <h2>El servicio</h2>
      <p>
        {APP_NAME} es una plataforma de análisis de inventario provista
        tal cual está, sin garantías explícitas o implícitas de
        disponibilidad, idoneidad para un propósito particular ni de
        ausencia de errores. Hacemos lo posible por mantenerla estable y
        funcionando, pero pueden ocurrir interrupciones, bugs o
        pérdidas temporales de datos.
      </p>

      <h2>Tu cuenta</h2>
      <ul>
        <li>
          El acceso es <strong>por invitación</strong> — no hay registro
          público abierto.
        </li>
        <li>
          Eres responsable de mantener tus credenciales seguras y de toda
          actividad que ocurra bajo tu cuenta.
        </li>
        <li>
          Podemos suspender o eliminar cuentas que usen el servicio de
          forma abusiva o que comprometan la seguridad de otros usuarios.
        </li>
      </ul>

      <h2>Tus datos</h2>
      <ul>
        <li>
          Los datos que subes (XLSX, parámetros del cubo, configuración)
          son tuyos. No los compartimos, vendemos ni cedemos a terceros.
        </li>
        <li>
          Procesamos esos datos exclusivamente para generar las vistas y
          cálculos que verás dentro de la plataforma.
        </li>
        <li>
          Si das de baja tu cuenta, eliminamos tus datos en un plazo
          razonable. Hasta ese momento permanecen almacenados de forma
          encriptada en Firebase (Google Cloud).
        </li>
      </ul>

      <h2>Usos no permitidos</h2>
      <ul>
        <li>Intentar acceder a cuentas o datos que no te pertenecen.</li>
        <li>
          Hacer ingeniería inversa, scraping masivo o cualquier abuso
          técnico del servicio.
        </li>
        <li>Subir contenido ilegal o que viole derechos de terceros.</li>
      </ul>

      <h2>Cambios</h2>
      <p>
        Estos términos pueden actualizarse. Si hay un cambio relevante te
        avisaremos por correo. El uso continuado del servicio después de
        un cambio significa que aceptas la versión actualizada.
      </p>

      <h2>Contacto</h2>
      <p>
        Para cualquier duda sobre estos términos, escribinos a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </PublicPageLayout>
  );
}
