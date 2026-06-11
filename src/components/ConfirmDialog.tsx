import { useState } from "react";

import { getError } from "src/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  handleClose: (response: boolean) => void;
  title: string;
  description: string;
  onAgree: () => Promise<void>;
  agreeText?: string;
  disagreeText?: string;
}

export default function ConfirmDialog({
  open,
  handleClose,
  onAgree,
  title,
  description,
  agreeText = "Confirmar",
  disagreeText = "Cancelar",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAgree = async () => {
    try {
      setLoading(true);
      setError(null);
      await onAgree();
      handleClose(true);
    } catch (e) {
      // Keep the dialog open and tell the user why it failed instead
      // of silently swallowing the rejection.
      setError(getError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setError(null);
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleDismiss()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" disabled={loading} onClick={handleDismiss}>
            {disagreeText}
          </Button>
          <Button onClick={handleAgree} autoFocus loading={loading}>
            {agreeText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
