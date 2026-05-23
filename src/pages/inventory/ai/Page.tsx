import { useState } from "react";

import { httpsCallable } from "firebase/functions";
import { useDocumentMetadata } from "src/hooks";
import { functions } from "src/lib/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Page = () => {
  useDocumentMetadata("AI - Trim Success");
  const [text, setText] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  async function callAi() {
    const addMessage = httpsCallable<{ question: string }, { reply: string }>(
      functions,
      "aiGetMessage"
    );
    try {
      const result = await addMessage({ question: text });
      setResponse(result.data?.reply ?? "");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Pregunta algo..."
      />
      <Button onClick={callAi} className="self-start">
        Call AI
      </Button>
      {response && <p className="text-sm">{response}</p>}
    </div>
  );
};

export default Page;
