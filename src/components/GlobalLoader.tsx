import { Loader2 } from "lucide-react";

export default function GlobalLoader() {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className="fixed inset-0 z-[1400] flex items-center justify-center bg-black/50 text-white"
    >
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
}
