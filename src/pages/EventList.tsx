import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Fab,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextField,
  InputAdornment,
  Paper,
  Collapse,
  Alert,
  FormControl,
  Container,
  IconButton
} from "@mui/material";
import PageHeader from "../components/PageHeader";
import EventCard from "../components/EventCard";
import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { Event } from "../types";
import { eventService } from "../services/eventService";
import { useAuth } from "../context/AuthContext";
import CreateEventModal from "../components/CreateEventModal";
import HomeInsightsView from "../components/HomeInsights";
import RefreshIcon from "@mui/icons-material/Refresh";
import PullToRefresh from "../components/PullToRefresh";

const EventList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [myClubOnly, setMyClubOnly] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [clubFilter, setClubFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);


  const filteredEvents = events.filter((event) => {
    // My club filter
    if (myClubOnly && event.created_by !== user?.id) return false;

    // Category filter
    if (categoryFilter !== "all" && event.category !== categoryFilter)
      return false;

    // Club filter
    if (clubFilter !== "all" && event.club !== clubFilter)
      return false;

    // 🔍 Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        event.title.toLowerCase().includes(q) ||
        event.description?.toLowerCase().includes(q)
      );
    }

    return true;
  });



  const categories = Array.from(
    new Set(events.map(e => e.category).filter(Boolean))
  );


  const clubs = Array.from(
    new Set(
      events
        .map(e => e.club)
        .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
        .map(c => c.trim().toLowerCase())
    )
  ).map(c =>
    c.replace(/\b\w/g, char => char.toUpperCase())
  );



  const canUseMyClubFilter =
    user?.is_super_admin || user?.is_admin;


  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      setEvents(data);
      setError("");
    } catch (err: any) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventClick = (eventId: number) => {
    navigate(`/events/${eventId}`);
  };

  const handleCreateEvent = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleEventCreated = () => {
    fetchEvents();
    setOpenModal(false);
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
        <Typography>Loading events...</Typography>
      </Container>
    );
  }

  return (
    <>
      <PullToRefresh onRefresh={fetchEvents}>
        <Box sx={{ pb: 8 }}>
          <PageHeader
            title="Explore Events"
            subtitle="Discover workshops, seminars, and cultural activities happening on campus."
          />

          <HomeInsightsView />

          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              All Events
            </Typography>
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={() => setShowFilters((prev) => !prev)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </Box>

          {/* FILTER PANEL */}
          <Collapse in={showFilters}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <Grid container spacing={2} alignItems="center">
                {canUseMyClubFilter && (
                  <Grid size={{ xs: 12, md: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={myClubOnly}
                          onChange={(e) => setMyClubOnly(e.target.checked)}
                        />
                      }
                      label="My Club Events"
                    />
                  </Grid>
                )}

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      label="Category"
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Club</InputLabel>
                    <Select
                      value={clubFilter}
                      label="Club"
                      onChange={(e) => setClubFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Clubs</MenuItem>
                      {clubs.map((club) => (
                        <MenuItem key={club} value={club}>
                          {club}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Collapse>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {events.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 8, py: 8, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary">
                No events available at the moment.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredEvents.map((event) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={event.id}>
                  <EventCard event={event} onClick={() => handleEventClick(event.id)} />
                </Grid>
              ))}
            </Grid>
          )}

          {filteredEvents.length === 0 && events.length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body1" color="text.secondary">No events match your filters.</Typography>
              <Button sx={{ mt: 1 }} onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setClubFilter("all");
              }}>Clear Filters</Button>
            </Box>
          )}



        </Box>
      </PullToRefresh>

      {/* FAB for Admin - Outside PullToRefresh to maintain fixed position */}
      {isAdmin && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}
          onClick={handleCreateEvent}
        >
          <AddIcon />
        </Fab>
      )}

      <CreateEventModal
        open={openModal}
        onClose={handleModalClose}
        onEventCreated={handleEventCreated}
      />
    </>
  );
};

export default EventList;
