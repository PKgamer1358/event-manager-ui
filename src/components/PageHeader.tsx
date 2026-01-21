import React from 'react';
import { Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    breadcrumbs?: { label: string; href?: string }[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action, breadcrumbs }) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ mb: 4 }}>
            {breadcrumbs && (
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ mb: 2 }}
                >
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return crumb.href && !isLast ? (
                            <Link
                                underline="hover"
                                key={crumb.label}
                                color="inherit"
                                onClick={() => navigate(crumb.href!)}
                                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <Typography key={crumb.label} color="text.primary">
                                {crumb.label}
                            </Typography>
                        );
                    })}
                </Breadcrumbs>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px' }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {action && (
                    <Box sx={{ ml: 2 }}>
                        {action}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default PageHeader;
