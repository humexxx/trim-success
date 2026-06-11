import { useState } from "react";

import { ICallableRequest } from "@shared/models/functions";
import { httpsCallable } from "firebase/functions";
import { useAuth } from "src/context/hooks";
import { useDocumentMetadata } from "src/hooks";
import { functions } from "src/lib/firebase";
import { getError } from "src/utils";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Page = () => {
  useDocumentMetadata(
    "Asistente IA",
    "Asistente conversacional para responder preguntas sobre tu inventario."
  );
  const { isAdmin, customUser, currentUser } = useAuth();
  const [text, setText] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function callAi() {
    const question = text.trim();
    const uid = isAdmin ? customUser?.uid : currentUser?.uid;
    if (!question || !uid) return;

    const aiGetMessage = httpsCallable<
      ICallableRequest<{ question: string }>,
      { message: string }
    >(functions, "aiGetMessage");
    setLoading(true);
    setError(null);
    try {
      const result = await aiGetMessage({ uid, data: { question } });
      setResponse(result.data?.message ?? "");
    } catch (e) {
      setError(getError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Pregunta algo..."
      />
      <Button
        onClick={callAi}
        className="self-start"
        loading={loading}
        disabled={!text.trim()}
      >
        Preguntar
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {response && <p className="text-sm">{response}</p>}
    </div>
  );
};

export default Page;
