import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  Chip,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";
import { Registration } from "../types";
import { registrationService } from "../services/registrationService";

const MyRegistrations: React.FC = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await registrationService.getMyRegistrations();
      setRegistrations(data);
      setError("");
    } catch (err: any) {
      setError("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleUnregister = async (eventId: number) => {
    if (
      !window.confirm("Are you sure you want to unregister from this event?")
    ) {
      return;
    }

    try {
      await registrationService.unregisterFromEvent(eventId);
      setSuccess("Successfully unregistered from the event!");
      fetchRegistrations();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to unregister from event");
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading your registrations...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Registrations
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {registrations.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            You haven't registered for any events yet
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/events")}
          >
            Browse Events
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {registrations.map((registration) => (
            <Card key={registration.id}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {registration.event?.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {registration.event?.description}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {registration.event?.venue}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <EventIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {registration.event?.start_time &&
                          formatDateTime(registration.event.start_time)}
                      </Typography>
                    </Box>
                    <Chip
                      label={`Registered on ${formatDateTime(
                        registration.registered_at
                      )}`}
                      size="small"
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/events/${registration.event_id}`)}
                >
                  View Event
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleUnregister(registration.event_id)}
                >
                  Unregister
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MyRegistrations;
