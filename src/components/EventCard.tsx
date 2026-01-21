import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Button,
    CardActions,
    Stack,
    alpha,
    useTheme
} from '@mui/material';
import { Event } from '../types';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import StatusChip from './StatusChip';

interface EventCardProps {
    event: Event;
    onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
    const theme = useTheme();

    const handleDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };

    const handleTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const isFull = event.registered_count !== undefined && event.registered_count >= event.capacity;
    const status = isFull ? 'Full' : (new Date(event.start_time) < new Date() ? 'Past' : 'Open');

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[10],
                    '& .MuiCardMedia-root': {
                        transform: 'scale(1.05)'
                    }
                },
                overflow: 'hidden'
            }}
        >
            {/* Image / Gradient Header */}
            <Box sx={{ position: 'relative', overflow: 'hidden', height: 160 }}>
                <CardMedia
                    component={event.image_url ? "img" : "div"}
                    height="160"
                    image={event.image_url}
                    sx={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: !event.image_url ? theme.palette.primary.main : 'transparent',
                        background: !event.image_url ? `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` : undefined,
                        transition: 'transform 0.5s ease',
                        objectFit: 'cover'
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        px: 1,
                        py: 0.5,
                        fontWeight: 'bold',
                        boxShadow: 2,
                        fontSize: '0.75rem',
                        color: 'text.primary',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        lineHeight: 1
                    }}
                >
                    <Box component="span" sx={{ fontSize: '1rem', fontWeight: 800 }}>
                        {new Date(event.start_time).getDate()}
                    </Box>
                    <Box component="span" sx={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                        {new Date(event.start_time).toLocaleString('default', { month: 'short' })}
                    </Box>
                </Box>
                <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                    <StatusChip status={status} />
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Stack spacing={1.5}>
                    <Typography variant="overline" color="primary" sx={{ fontWeight: 700, lineHeight: 1 }}>
                        {event.category}
                    </Typography>

                    <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                        {event.title}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                        <CalendarMonthIcon fontSize="small" color="action" />
                        <Typography variant="body2">{handleTime(event.start_time)}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography variant="body2" noWrap>{event.venue}</Typography>
                    </Stack>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <PeopleIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary">
                                {event.registered_count || 0} / {event.capacity} registered
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={onClick}
                    sx={{
                        borderWidth: '2px',
                        '&:hover': { borderWidth: '2px' },
                        fontWeight: 600
                    }}
                >
                    View Details
                </Button>
            </CardActions>
        </Card>
    );
};

export default EventCard;
