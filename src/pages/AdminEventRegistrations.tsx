import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TableContainer,
  Paper,
  CircularProgress,
  Alert
} from "@mui/material";
import PageHeader from "../components/PageHeader";
import { Registration, Event } from "../types";
import { eventService } from "../services/eventService";
import { registrationService } from "../services/registrationService";

const AdminEventRegistrations: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (err) {
        setError("Failed to load events list.");
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const fetchRegistrations = async (eventId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registrationService.getEventRegistrations(eventId);
      setRegistrations(data);
    } catch (err) {
      setError("Unable to load registrations.");
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (e: any) => {
    const val = e.target.value;
    setSelectedEventId(val);
    if (val) {
      fetchRegistrations(Number(val));
    } else {
      setRegistrations([]);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Event Registrations"
        subtitle="View and manage registrations for specific events."
      />

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FormControl fullWidth size="small">
              <InputLabel>Select Event</InputLabel>
              <Select
                value={selectedEventId}
                label="Select Event"
                onChange={handleEventChange}
                disabled={eventsLoading}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {events.map((evt) => (
                  <MenuItem key={evt.id} value={evt.id}>
                    {evt.title} ({new Date(evt.start_time).toLocaleDateString()})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {eventsLoading && <CircularProgress size={24} />}
          </Stack>
        </CardContent>
      </Card>

      {/* STATES */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* TABLE */}
      {!loading && selectedEventId && registrations.length > 0 && (
        <Card>
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>USN / Roll No</b></TableCell>
                  <TableCell><b>Year</b></TableCell>
                  <TableCell><b>Branch</b></TableCell>
                  <TableCell><b>Registered At</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrations.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.user?.first_name} {r.user?.last_name}</TableCell>
                    <TableCell>{r.user?.email}</TableCell>
                    <TableCell>{r.user?.roll_number || r.user?.username || "-"}</TableCell>
                    <TableCell>{r.user?.year_of_study || "-"}</TableCell>
                    <TableCell>{r.user?.branch || "-"}</TableCell>
                    <TableCell>{new Date(r.registered_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {!loading && selectedEventId && registrations.length === 0 && (
        <Alert severity="info" variant="outlined">No registrations found for this event.</Alert>
      )}

      {!selectedEventId && !eventsLoading && (
        <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
          <Typography>Please select an event to view registrations.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default AdminEventRegistrations;
