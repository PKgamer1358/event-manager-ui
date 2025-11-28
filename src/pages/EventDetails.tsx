import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useNavigate } from "react-router-dom";
import { Event, Registration } from "../types";
import { eventService } from "../services/eventService";
import { registrationService } from "../services/registrationService";
import { useAuth } from "../context/AuthContext";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);

  const fetchEventDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await eventService.getEventById(parseInt(id));
      setEvent(data);
      setError("");
    } catch (err: any) {
      setError("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    if (!id) return;

    try {
      const myRegs = await registrationService.getMyRegistrations();
      const isReg = myRegs.some((reg) => reg.event_id === parseInt(id));
      setIsRegistered(isReg);

      if (isAdmin) {
        const regs = await registrationService.getEventRegistrations(
          parseInt(id)
        );
        setRegistrations(regs);
      }
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    }
  };

  useEffect(() => {
    fetchEventDetails();
    fetchRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRegister = async () => {
    if (!id) return;

    try {
      await registrationService.registerForEvent(parseInt(id));
      setSuccess("Successfully registered for the event!");
      setIsRegistered(true);
      fetchEventDetails();
      fetchRegistrations();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to register for event");
    }
  };

  const handleUnregister = async () => {
    if (!id) return;

    try {
      await registrationService.unregisterFromEvent(parseInt(id));
      setSuccess("Successfully unregistered from the event!");
      setIsRegistered(false);
      fetchEventDetails();
      fetchRegistrations();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to unregister from event");
    }
  };

  const handleDeleteEvent = async () => {
    if (!id || !window.confirm("Are you sure you want to delete this event?"))
      return;

    try {
      await eventService.deleteEvent(parseInt(id));
      navigate("/events");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete event");
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading event details...</Typography>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Event not found</Alert>
      </Container>
    );
  }

  const isFull = (event.registered_count || 0) >= event.capacity;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            {event.title}
          </Typography>
          {isAdmin && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteEvent}
            >
              Delete Event
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Venue:</strong> {event.venue}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PeopleIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Capacity:</strong> {event.registered_count || 0} /{" "}
                {event.capacity}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EventIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Start:</strong> {formatDateTime(event.start_time)}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EventIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>End:</strong> {formatDateTime(event.end_time)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {isFull && !isRegistered && (
          <Chip label="Event is Full" color="error" sx={{ mb: 2 }} />
        )}

        {isRegistered && (
          <Chip label="You are registered" color="success" sx={{ mb: 2 }} />
        )}

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          {!isAdmin && (
            <>
              {!isRegistered ? (
                <Button
                  variant="contained"
                  onClick={handleRegister}
                  disabled={isFull}
                >
                  Register for Event
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleUnregister}
                >
                  Unregister
                </Button>
              )}
            </>
          )}

          {isAdmin && (
            <Button
              variant="outlined"
              onClick={() => setShowRegistrations(true)}
            >
              View Registrations ({registrations.length})
            </Button>
          )}

          <Button variant="outlined" onClick={() => navigate("/events")}>
            Back to Events
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={showRegistrations}
        onClose={() => setShowRegistrations(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Event Registrations</DialogTitle>
        <DialogContent>
          {registrations.length === 0 ? (
            <Typography>No registrations yet</Typography>
          ) : (
            <List>
              {registrations.map((reg) => (
                <ListItem key={reg.id}>
                  <ListItemText
                    primary={reg.user?.full_name || reg.user?.email}
                    secondary={`Registered at: ${new Date(
                      reg.registered_at
                    ).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRegistrations(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails;
