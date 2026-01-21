import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
    Button,
    Grid,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventIcon from '@mui/icons-material/Event';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { eventService } from '../services/eventService';
import { GlobalInsights } from '../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomeInsightsView: React.FC = () => {
    const { isAdmin } = useAuth();
    const [insights, setInsights] = useState<GlobalInsights | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const data = await eventService.getGlobalInsights();
                setInsights(data);
            } catch (error: any) {
                console.error("Failed to load global insights", error);
                setError(error.message || "Failed to load insights");
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    if (loading) return null;
    if (error) return <Typography color="error" sx={{ mb: 2 }}>Error: {error}</Typography>;
    if (!insights) return null;

    if (isAdmin) {
        return (
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <AdminPanelSettingsIcon color="error" />
                    <Typography variant="h5" fontWeight="bold">
                        Admin Dashboard Overview
                    </Typography>
                </Stack>

                <Grid container spacing={3}>
                    {/* Events Overview */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, height: '100%', borderLeft: 4, borderColor: 'primary.main' }}>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                                <EventIcon color="primary" fontSize="large" />
                                <Typography variant="h6" fontWeight="bold">Total Events</Typography>
                            </Stack>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">{insights.total_events_active || 0}</Typography>
                                    <Typography variant="body2" color="text.secondary">Active</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="h4" fontWeight="bold" color="text.secondary">{insights.total_events_past || 0}</Typography>
                                    <Typography variant="body2" color="text.secondary">Past</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Registrations */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, height: '100%', borderLeft: 4, borderColor: 'success.main' }}>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                                <AppRegistrationIcon color="success" fontSize="large" />
                                <Typography variant="h6" fontWeight="bold">Registrations</Typography>
                            </Stack>
                            <Typography variant="h4" fontWeight="bold">{insights.total_registrations_all_time || 0}</Typography>
                            <Typography variant="body2" color="text.secondary">All Time</Typography>
                            <Box sx={{ mt: 'auto', pt: 1 }}>
                                <Chip
                                    label={`+${insights.total_registrations_this_week || 0} this week`}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    icon={<TrendingUpIcon />}
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Most Popular Event */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, height: '100%', borderLeft: 4, borderColor: 'secondary.main' }}>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                                <AutoAwesomeIcon color="secondary" fontSize="large" />
                                <Typography variant="h6" fontWeight="bold">Most Popular (Open)</Typography>
                            </Stack>
                            {insights.most_popular_event_title ? (
                                <>
                                    <Typography variant="h6" fontWeight="bold" noWrap title={insights.most_popular_event_title}>
                                        {insights.most_popular_event_title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {insights.most_popular_event_count} Registrations
                                    </Typography>
                                    {insights.most_popular_event_id && (
                                        <Box sx={{ mt: 'auto', pt: 1 }}>
                                            <Button
                                                component={Link}
                                                to={`/events/${insights.most_popular_event_id}`}
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                            >
                                                View Event
                                            </Button>
                                        </Box>
                                    )}
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">No events yet.</Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    // Student View
    return (
        <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <AutoAwesomeIcon color="secondary" />
                <Typography variant="h5" fontWeight="bold">
                    Campus Pulse
                </Typography>
            </Stack>

            <Grid container spacing={3}>
                {/* Quick Stats */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6, md: 12 }}>
                            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
                                <EventIcon color="primary" fontSize="large" />
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">{insights.total_events_this_week || 0}</Typography>
                                    <Typography variant="body2" color="text.secondary">Events This Week</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 6, md: 12 }}>
                            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
                                <AppRegistrationIcon color="success" fontSize="large" />
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">{insights.total_registrations_today || 0}</Typography>
                                    <Typography variant="body2" color="text.secondary">Registrations Today</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Trending Events */}
                <Grid size={{ xs: 12, md: 9 }}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                            <TrendingUpIcon color="error" />
                            <Typography variant="h6" fontWeight="bold">Trending Now</Typography>
                        </Stack>

                        <Grid container spacing={2}>
                            {insights.trending_events && insights.trending_events.length > 0 ? (
                                insights.trending_events.map((evt) => (
                                    <Grid size={{ xs: 12, sm: 4 }} key={evt.id}>
                                        <Card variant="outlined" sx={{ '&:hover': { boxShadow: 2 } }}>
                                            <CardContent>
                                                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                                    {evt.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                                    {evt.date}
                                                </Typography>
                                                <Button
                                                    component={Link}
                                                    to={`/events/${evt.id}`}
                                                    size="small"
                                                    variant="outlined"
                                                    fullWidth
                                                >
                                                    View Details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                                    No trending events right now.
                                </Typography>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HomeInsightsView;
