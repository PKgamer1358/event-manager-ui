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
    image_url?: string;
    category: string;
    club?: string;
    venue: string;
    start_time: string;
    end_time?: string | null;  // ✅ UPDATED
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
    end_time: "",  // Initialize as empty string
    capacity: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    });
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let eventId: number;

      if (eventToEdit) {
        // Sanitize payload for update
        const payload = {
          ...formData,
          end_time: formData.end_time === "" ? null : formData.end_time,
        };
        await eventService.updateEvent(eventToEdit.id, payload);
        eventId = eventToEdit.id;
        if (onEventUpdated) onEventUpdated();
      } else {
        // Sanitize payload for create
        const payload = {
          ...formData,
          end_time: formData.end_time === "" ? null : formData.end_time,
        };
        const newEvent = await eventService.createEvent(payload);
        eventId = newEvent.id;
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

      // Upload Cover Image if selected
      if (coverImage) {
        await eventService.uploadCoverImage(eventId, coverImage);
        setCoverImage(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create/update event");
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
    setCoverImage(null);
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
        end_time: eventToEdit.end_time || "", // Handle null from backend
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
              <MenuItem value="Drama">Drama</MenuItem>
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
            // required  <-- REMOVED
            fullWidth
            name="end_time"
            label="End Time"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={formData.end_time || ""} // Handle null/undefined
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

          <Box sx={{ mt: 2 }}>
            <InputLabel shrink>Cover Image (Optional)</InputLabel>
            <input
              accept="image/*"
              type="file"
              onChange={handleFileChange}
              style={{ paddingTop: '10px' }}
            />
            {eventToEdit?.image_url && !coverImage && (
              <Box sx={{ mt: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
                Current image will be kept unless you upload a new one.
              </Box>
            )}
          </Box>
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
