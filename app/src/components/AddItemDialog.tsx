import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
  Add as PlusIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";

interface AddItemDialogProps {
  open: boolean;
  onCreate: (values: { title: string; icon?: string }) => void;
  onCancel: () => void;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({
  open,
  onCreate,
  onCancel,
}) => {
  const { control, handleSubmit, reset } = useForm<{
    title: string;
    icon?: string;
  }>({
    defaultValues: {
      title: "",
      icon: "FileIcon",
    },
  });

  const onSubmit = (data: { title: string; icon?: string }) => {
    onCreate(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>
        Add New Item
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
            rules={{ required: "Please input the title of the item!" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Title"
                variant="outlined"
                fullWidth
                error={!!error}
                helperText={error ? error.message : ""}
                margin="normal"
              />
            )}
          />
          <Controller
            name="icon"
            control={control}
            defaultValue="FileIcon"
            render={({ field }) => (
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="icon-label">Icon</InputLabel>
                <Select {...field} labelId="icon-label" label="Icon">
                  <MenuItem value="FileIcon">
                    <FileIcon sx={{ mr: 1 }} />
                    File
                  </MenuItem>
                  <MenuItem value="PlusIcon">
                    <PlusIcon sx={{ mr: 1 }} />
                    Plus
                  </MenuItem>
                </Select>
              </FormControl>
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

export default AddItemDialog;
