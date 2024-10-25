import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";

interface AddFolderDialogProps {
  open: boolean;
  onCreate: (values: { title: string }) => void;
  onCancel: () => void;
}

const AddFolderDialog: React.FC<AddFolderDialogProps> = ({
  open,
  onCreate,
  onCancel,
}) => {
  const { control, handleSubmit, reset } = useForm<{ title: string }>();

  const onSubmit = (data: { title: string }) => {
    onCreate(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>
        Add New Folder
        <IconButton
          aria-label="close"
          onClick={onCancel}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: "Please input the folder title!" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Folder Title"
                variant="outlined"
                fullWidth
                error={!!error}
                helperText={error ? error.message : ""}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddFolderDialog;
