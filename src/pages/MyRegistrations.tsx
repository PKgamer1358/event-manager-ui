import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Grid,
  CircularProgress,
  Tabs,
  Tab
} from "@mui/material";
import EventCard from "../components/EventCard";
import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";
import { Registration } from "../types";
import { registrationService } from "../services/registrationService";
import { useAuth } from "../context/AuthContext";

const MyRegistrations: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || isAdmin) {
      navigate("/events");
    }
  }, [isAuthenticated, isAdmin, navigate]);

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
    if (isAuthenticated && !isAdmin) {
      fetchRegistrations();
    }
  }, [isAuthenticated, isAdmin]);

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const now = new Date();
  const upcomingEvents = registrations.filter(r => r.event && new Date(r.event.start_time) >= now);
  const pastEvents = registrations.filter(r => r.event && new Date(r.event.start_time) < now);

  const renderEventList = (list: Registration[], showUnregister: boolean) => (
    <Grid container spacing={3}>
      {list.map((registration) => {
        const event = registration.event;
        if (!event) return null;
        return (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={registration.id}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <EventCard
                event={event}
                onClick={() => navigate(`/events/${event.id}`)}
              />
              <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 1 }}>
                <Box>
                  <Typography variant="caption" display="block" color="text.secondary">Registered on</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {new Date(registration.registered_at).toLocaleDateString()}
                  </Typography>
                </Box>
                {showUnregister && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleUnregister(registration.event_id)}
                  >
                    Unregister
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );

  return (
    <Box sx={{ pb: 8 }}>
      <PageHeader
        title="My Registrations"
        subtitle="Manage your upcoming events and view past registrations."
      />

      <Container maxWidth="xl">
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

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label={`Upcoming (${upcomingEvents.length})`} />
            <Tab label={`History (${pastEvents.length})`} />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box>
            {upcomingEvents.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No upcoming events.
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/events")}>
                  Browse Events
                </Button>
              </Box>
            ) : (
              renderEventList(upcomingEvents, true)
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            {pastEvents.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No past events found.
              </Typography>
            ) : (
              renderEventList(pastEvents, false)
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MyRegistrations;
