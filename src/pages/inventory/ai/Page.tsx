import { useState } from "react";

import { Button, TextField } from "@mui/material";
import { httpsCallable } from "firebase/functions";
import { functions } from "src/lib/firebase";
import { useDocumentMetadata } from "src/hooks";

const Page = () => {
  useDocumentMetadata("AI - Trim Success");
  const [text, setText] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  async function callAi() {
    const addMessage = httpsCallable(functions, "aiGetMessage");
    try {
      const response = await addMessage({
        question: text,
      });
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <TextField value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={callAi}>Call AI</Button>
      <p>{response}</p>
    </>
  );
};

export default Page;
