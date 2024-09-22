import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { LoadingButton } from "@mui/lab";

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
  agreeText = "Agree",
  disagreeText = "Disagree",
}: Props) {
  const [loading, setLoading] = React.useState(false);

  const _handleClose = async () => {
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
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={() => handleClose(false)}>
          {disagreeText}
        </Button>
        <LoadingButton onClick={_handleClose} autoFocus loading={loading}>
          {agreeText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
