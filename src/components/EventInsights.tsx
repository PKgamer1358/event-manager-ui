import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    Stack,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Button,
    Divider,
    Grid
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import RecommendIcon from '@mui/icons-material/Recommend';
import EventIcon from '@mui/icons-material/Event';
import { eventService } from '../services/eventService';
import { EventInsights } from '../types';
import { Link } from 'react-router-dom';

interface EventInsightsProps {
    eventId: number;
}

const EventInsightsView: React.FC<EventInsightsProps> = ({ eventId }) => {
    const [insights, setInsights] = useState<EventInsights | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const data = await eventService.getEventInsights(eventId);
                setInsights(data);
            } catch (error) {
                console.error("Failed to load insights", error);
            } finally {
                setLoading(false);
            }
        };
        if (eventId) fetchInsights();
    }, [eventId]);

    if (loading) return <CircularProgress size={24} sx={{ ml: 2 }} />;

    if (!insights) return <Typography color="text.secondary">No insights available yet.</Typography>;

    const getDemandColor = (level: string) => {
        switch (level) {
            case 'Very High': return 'error';
            case 'High': return 'warning';
            case 'Medium': return 'info';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RecommendIcon color="secondary" />
                AI-Powered Insights
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Real-time analysis based on registration trends and student preferences.
            </Typography>

            <Grid container spacing={3}>
                {/* Demand Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(255, 255, 255, 0.9)', borderLeft: 4, borderColor: 'primary.main' }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <TrendingUpIcon color="primary" />
                            <Typography variant="subtitle1" fontWeight="bold">Demand Score</Typography>
                        </Stack>
                        <Chip
                            label={insights.demand_level}
                            color={getDemandColor(insights.demand_level) as any}
                            sx={{ fontWeight: 'bold' }}
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {insights.demand_level === 'High' || insights.demand_level === 'Very High'
                                ? "This event is filling up faster than average."
                                : "Registration pace is normal."}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Demographics Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2, height: '100%', borderLeft: 4, borderColor: 'secondary.main' }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <GroupIcon color="secondary" />
                            <Typography variant="subtitle1" fontWeight="bold">Vibe Check</Typography>
                        </Stack>
                        {insights.top_demographics.length > 0 ? (
                            <List dense disablePadding>
                                {insights.top_demographics.map((demo, i) => (
                                    <ListItem key={i} disablePadding>
                                        <ListItemText primary={`• ${demo}`} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="caption" color="text.secondary">Not enough data yet.</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Similar Events */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2, height: '100%', borderLeft: 4, borderColor: 'info.main' }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <EventIcon color="info" />
                            <Typography variant="subtitle1" fontWeight="bold">You Might Like</Typography>
                        </Stack>
                        {insights.similar_events.length > 0 ? (
                            <List dense disablePadding>
                                {insights.similar_events.map((evt) => (
                                    <ListItem key={evt.id} disableGutters>
                                        <Button
                                            component={Link}
                                            to={`/events/${evt.id}`}
                                            size="small"
                                            sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                                        >
                                            {evt.title}
                                        </Button>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="caption" color="text.secondary">No recommendations.</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EventInsightsView;
