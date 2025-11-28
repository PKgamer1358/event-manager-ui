import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
} from "@mui/material";
import { eventService } from "../services/eventService";
import { EventFormData } from "../types";

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  open,
  onClose,
  onEventCreated,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    venue: "",
    start_time: "",
    end_time: "",
    capacity: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await eventService.createEvent(formData);
      setFormData({
        title: "",
        description: "",
        venue: "",
        start_time: "",
        end_time: "",
        capacity: 0,
      });
      onEventCreated();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      venue: "",
      start_time: "",
      end_time: "",
      capacity: 0,
    });
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Event</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            name="title"
            label="Event Title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="description"
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="venue"
            label="Venue"
            value={formData.venue}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="start_time"
            label="Start Time"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={formData.start_time}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="end_time"
            label="End Time"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={formData.end_time}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="capacity"
            label="Capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateEventModal;
