import { useState } from "react";

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

  const handleAgree = async () => {
    try {
      setLoading(true);
      await onAgree();
      handleClose(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => handleClose(false)}
          >
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
