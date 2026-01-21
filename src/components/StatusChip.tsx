import React from "react";
import { Chip, ChipProps, alpha, darken } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface StatusChipProps extends Omit<ChipProps, "color"> {
    status: string; // can be flexible
}

const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (['active', 'approved', 'open', 'published'].includes(s)) return 'success';
    if (['pending', 'upcoming', 'draft'].includes(s)) return 'warning';
    if (['rejected', 'cancelled', 'closed', 'full', 'past'].includes(s)) return 'error';
    return 'primary';
};

const StatusChip: React.FC<StatusChipProps> = ({ status, sx, ...props }) => {
    const theme = useTheme();
    const colorKey = getStatusColor(status);

    // Use solid colors for better visibility on images
    const mainColor = (theme.palette as any)[colorKey].main;
    const textColor = "#ffffff";

    return (
        <Chip
            label={status}
            size="small"
            sx={{
                fontWeight: 700,
                borderRadius: '6px',
                backgroundColor: mainColor,
                color: textColor,
                border: '1px solid rgba(255,255,255,0.2)',
                textTransform: 'capitalize',
                boxShadow: 2,
                ...sx,
            }}
            {...props}
        />
    );
};

export default StatusChip;
