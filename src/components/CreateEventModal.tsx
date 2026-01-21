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
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";


interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onEventCreated?: () => void;
  onEventUpdated?: () => void;
  eventToEdit?: {
    id: number;
    title: string;
    description: string;
    category: string;   // ✅ ADD
    club?: string; 
    venue: string;
    start_time: string;
    end_time: string;
    capacity: number;
  } | null;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  open,
  onClose,
  onEventCreated,
  onEventUpdated,
  eventToEdit = null,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    category: "",     
    club: "", 
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
      if (eventToEdit) {
        await eventService.updateEvent(eventToEdit.id, formData);
        if (onEventUpdated) onEventUpdated();
      } else {
        await eventService.createEvent(formData);
        setFormData({
          title: "",
          description: "",
          category: "",     
    club: "", 
          venue: "",
          start_time: "",
          end_time: "",
          capacity: 0,
        });
        if (onEventCreated) onEventCreated();
      }
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
      category: "",     
    club: "", 
      venue: "",
      start_time: "",
      end_time: "",
      capacity: 0,
    });
    setError("");
    onClose();
  };

  React.useEffect(() => {
  if (eventToEdit) {
    setFormData({
      title: eventToEdit.title,
      description: eventToEdit.description,
      category: eventToEdit.category, // ✅ ADD
      club: eventToEdit.club || "",   // ✅ ADD
      venue: eventToEdit.venue,
      start_time: eventToEdit.start_time,
      end_time: eventToEdit.end_time,
      capacity: eventToEdit.capacity,
    });
  }
}, [eventToEdit]);


  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{eventToEdit ? "Edit Event" : "Create New Event"}</DialogTitle>
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
          <FormControl fullWidth margin="normal" required>
  <InputLabel>Category</InputLabel>
  <Select
    name="category"
    value={formData.category}
    label="Category"
    onChange={(e) =>
      setFormData({ ...formData, category: e.target.value })
    }
  >
    <MenuItem value="Technical">Technical</MenuItem>
    <MenuItem value="Cultural">Cultural</MenuItem>
    <MenuItem value="Sports">Sports</MenuItem>
  </Select>
</FormControl>
<TextField
  margin="normal"
  fullWidth
  name="club"
  label="Club (Optional)"
  placeholder="IEEE, CSI, Coding Club"
  value={formData.club}
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
            {loading ? (eventToEdit ? "Saving..." : "Creating...") : eventToEdit ? "Save Changes" : "Create Event"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateEventModal;
