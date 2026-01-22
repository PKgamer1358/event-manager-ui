import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Stack,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Divider,
  CircularProgress,
  useTheme
} from "@mui/material";
import axiosInstance from "../utils/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams, useNavigate } from "react-router-dom";
import { Event, EventMedia } from "../types";
import { eventService } from "../services/eventService";
import { API_BASE_URL } from "../utils/axios";
import { registrationService } from "../services/registrationService";
import { useAuth } from "../context/AuthContext";
import CreateEventModal from "../components/CreateEventModal";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`event-tabpanel-${index}`}
      aria-labelledby={`event-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EventDetails: React.FC = () => {
  const theme = useTheme();
  const { user, isAdmin } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [eventAnalytics, setEventAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [yearData, setYearData] = useState<any[]>([]);
  const [media, setMedia] = useState<EventMedia[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const fetchEventDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await eventService.getEventById(Number(id));
      setEvent(data);
    } catch {
      setError("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const checkMyRegistration = async () => {
    if (!id) return;
    try {
      const myRegs = await registrationService.getMyRegistrations();
      setIsRegistered(myRegs.some((r) => r.event_id === Number(id)));
    } catch {
      console.error("Failed to check registration");
    }
  };

  const loadRegistrations = async () => {
    if (!id) return;
    try {
      const regs = await registrationService.getEventRegistrations(Number(id));
      setRegistrations(regs);
      setShowRegistrations(true);
    } catch {
      setError("Failed to load registrations");
    }
  };


  const loadEventAnalytics = async () => {
    if (!id) return;
    try {
      const response = await axiosInstance.get(`/analytics/event/${id}`);
      const data = response.data;
      const formatted = data.labels.map((label: string, i: number) => ({
        name: label,
        value: data.values[i],
      }));
      setEventAnalytics(formatted);
    } catch (err) {
      console.error("Analytics error", err);
    }
  };

  const loadRegistrationsOverTime = async () => {
    if (!id) return;
    try {
      const res = await axiosInstance.get(`/analytics/event/${id}/registrations-over-time`);
      setTimelineData(res.data);
    } catch (err) {
      console.error("Failed to load timeline data", err);
    }
  };

  const loadRegistrationsByYear = async () => {
    if (!id) return;
    try {
      const res = await axiosInstance.get(`/analytics/event/${id}/registrations-by-year`);
      setYearData(res.data);
    } catch (err) {
      console.error("Failed to load year data", err);
    }
  };

  const fetchEventMedia = async () => {
    if (!id) return;
    try {
      const mediaData = await eventService.getEventMedia(Number(id));
      setMedia(mediaData);
    } catch (err) {
      console.error("Failed to fetch media", err);
    }
  };

  const getFileUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const handleRegister = async () => {
    if (!id) return;
    try {
      await registrationService.registerForEvent(Number(id));
      setSuccess("Successfully registered!");
      fetchEventDetails();
      checkMyRegistration();
      if (isAdmin) loadEventAnalytics();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  const handleUnregister = async () => {
    if (!id) return;
    try {
      await registrationService.unregisterFromEvent(Number(id));
      setSuccess("Successfully unregistered!");
      fetchEventDetails();
      checkMyRegistration();
      if (isAdmin) loadEventAnalytics();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Unregistration failed");
    }
  };

  const handleDeleteEvent = async () => {
    if (!id || !window.confirm("Delete this event?")) return;
    try {
      await eventService.deleteEvent(Number(id));
      navigate("/events");
    } catch {
      setError("Failed to delete event");
    }
  };

  const handleExportRegistrations = async () => {
    if (!id) return;
    try {
      const blob = await registrationService.exportEventRegistrations(Number(id));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${event?.title}_registrations.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Export failed");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!id || !uploadFile) return;
    try {
      setUploading(true);
      await eventService.uploadEventMedia(Number(id), uploadFile);
      setSuccess("File uploaded successfully");
      setUploadFile(null);
      fetchEventMedia();
    } catch (err: any) {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!id || !window.confirm("Delete this file?")) return;
    try {
      await eventService.deleteEventMedia(Number(id), mediaId);
      setSuccess("File deleted successfully");
      fetchEventMedia();
    } catch {
      setError("Failed to delete file");
    }
  };

  useEffect(() => {
    fetchEventDetails();
    checkMyRegistration();
    fetchEventMedia();
    if (isAdmin) {
      loadEventAnalytics();
      loadRegistrationsOverTime();
      loadRegistrationsByYear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAdmin]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Event not found</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/events")} sx={{ mt: 2 }}>Back to Events</Button>
      </Container>
    );
  }

  const canEdit = user?.is_super_admin || (user?.is_admin && event?.created_by === user?.id);
  const isFull = (event.registered_count || 0) >= event.capacity;
  const eventStart = new Date(event.start_time);
  const diffTime = eventStart.getTime() - new Date().getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isCloseToStart = daysRemaining <= 3;
  const status = isFull ? 'Full' : (eventStart < new Date() ? 'Past' : 'Open');

  return (
    <Box sx={{ pb: 8 }}>
      <Box
        sx={{
          position: 'relative',
          height: { xs: 200, md: 350 },
          width: '100%',
          bgcolor: 'grey.300',
          overflow: 'hidden'
        }}
      >
        {event.image_url ? (
          <Box
            component="img"
            src={event.image_url}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` }} />
        )}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            p: 4,
            pt: 8
          }}
        >
          <Container maxWidth="xl">
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="flex-end" justifyContent="space-between" spacing={2}>
              <Box sx={{ color: 'white' }}>
                <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                  <Chip
                    label={event.category}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                  <Chip
                    label={status}
                    color={status === 'Open' ? 'success' : 'error'}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                <Typography variant="h3" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {event.title}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1, color: 'rgba(255,255,255,0.9)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EventIcon fontSize="small" />
                    <Typography variant="body1">{new Date(event.start_time).toLocaleDateString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body1">{event.venue}</Typography>
                  </Box>
                </Stack>
              </Box>
              <Stack direction="row" spacing={1}>
                {canEdit && (
                  <>
                    <Button variant="contained" color="inherit" startIcon={<EditIcon />} sx={{ color: 'text.primary' }} onClick={() => setEditModalOpen(true)}>
                      Edit
                    </Button>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteEvent}>
                      Delete
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>
          </Container>
        </Box>
        <IconButton
          sx={{ position: 'absolute', top: 16, left: 16, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
          onClick={() => navigate('/events')}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Overview" />
            <Tab label="Media & Gallery" />
            {canEdit && <Tab label="Admin Dashboard" />}
          </Tabs>
        </Box>

        <Box sx={{ mt: 2 }}>
          {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
          {success && <Alert severity="success" onClose={() => setSuccess("")}>{success}</Alert>}
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={{ p: 4, mb: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">About Event</Typography>
                <Typography variant="body1" paragraph color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {event.description}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">Start Time</Typography>
                    <Typography variant="body1">{new Date(event.start_time).toLocaleString()}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">End Time</Typography>
                    <Typography variant="body1">{new Date(event.end_time).toLocaleString()}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">Club</Typography>
                    <Typography variant="body1">{event.club || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">Registration</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Spots Filled</Typography>
                      <Typography variant="body2" fontWeight="bold">{event.registered_count}/{event.capacity}</Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: 6, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                      <Box sx={{
                        width: `${Math.min(((event.registered_count || 0) / event.capacity) * 100, 100)}%`,
                        height: '100%',
                        bgcolor: isFull ? 'error.main' : 'success.main'
                      }} />
                    </Box>
                  </Box>
                </Box>

                {!isAdmin && (
                  <>
                    {!isRegistered ? (
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleRegister}
                        disabled={isFull}
                        sx={{ mt: 2 }}
                      >
                        {isFull ? "Event Full" : "Register Now"}
                      </Button>
                    ) : (
                      <Box sx={{ mt: 2 }}>
                        <Alert severity="success" sx={{ mb: 2 }}>You are registered!</Alert>
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          onClick={handleUnregister}
                          disabled={isCloseToStart}
                        >
                          Unregister
                        </Button>
                        {isCloseToStart && (
                          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                            Cannot unregister within 3 days.
                          </Typography>
                        )}
                      </Box>
                    )}
                  </>
                )}

                {isAdmin && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Admin View: Manage updates in Dashboard tab.
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {canEdit && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>Upload Media</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                >
                  Select File
                  <input
                    type="file"
                    hidden
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </Button>
                {uploadFile && <Typography variant="body2">{uploadFile.name}</Typography>}
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!uploadFile || uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </Stack>
            </Paper>
          )}

          <Typography variant="h6" gutterBottom>Attachments</Typography>
          <Stack spacing={2} sx={{ mb: 4 }}>
            {media.map((item) => (
              <Paper key={item.id} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 600 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DownloadIcon color="action" />
                  <Typography>{item.file_url.split('/').pop()}</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button href={getFileUrl(item.file_url)} target="_blank" variant="outlined" size="small">
                    Download
                  </Button>
                  {canEdit && (
                    <IconButton color="error" size="small" onClick={() => handleDeleteMedia(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Stack>
              </Paper>
            ))}
            {media.length === 0 && (
              <Typography color="text.secondary">No attachments available.</Typography>
            )}
          </Stack>
        </TabPanel>

        {canEdit && (
          <TabPanel value={tabValue} index={2}>
            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              <Button variant="contained" color="success" onClick={handleExportRegistrations}>
                Export Registrations (Excel)
              </Button>
              <Button variant="contained" onClick={loadRegistrations}>
                View Registrations List
              </Button>
            </Stack>

            <Typography variant="h5" gutterBottom>Analytics</Typography>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Registrations Trend</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke={theme.palette.primary.main} strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Registrations by Year</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={yearData}>
                      <XAxis dataKey="year" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Branch Distribution</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={eventAnalytics}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        {eventAnalytics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? theme.palette.primary.main : theme.palette.secondary.main} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        )}
      </Container>

      <Dialog open={showRegistrations} onClose={() => setShowRegistrations(false)} fullWidth maxWidth="sm">
        <DialogTitle>Registered Users</DialogTitle>
        <DialogContent dividers>
          {registrations.length === 0 ? (
            <Typography>No registrations found.</Typography>
          ) : (
            <List>
              {registrations.map((r, i) => (
                <React.Fragment key={r.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${r.user.first_name} ${r.user.last_name}`}
                      secondary={r.user.roll_number ? `${r.user.email} • ${r.user.roll_number}` : r.user.email}
                    />
                  </ListItem>
                  {i < registrations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRegistrations(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <CreateEventModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        eventToEdit={event}
        onEventUpdated={fetchEventDetails}
      />
    </Box>
  );
};

export default EventDetails;
