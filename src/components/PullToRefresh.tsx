import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: ReactNode;
    pullDownThreshold?: number;
    maxPullDownDistance?: number;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
    onRefresh,
    children,
    pullDownThreshold = 100, // Distance to trigger refresh
    maxPullDownDistance = 150 // Max visual pull distance
}) => {
    const [pullChange, setPullChange] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const startY = useRef(0);
    const isPulling = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e: TouchEvent) => {
            // Only enable pull if we are at the top of the container
            if (window.scrollY > 0) return;

            startY.current = e.touches[0].clientY;
            isPulling.current = true;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isPulling.current) return;
            if (window.scrollY > 0) return;

            const currentY = e.touches[0].clientY;
            const diff = currentY - startY.current;

            if (diff > 0) {
                // Prevent default only if we are pulling down at the top
                if (e.cancelable) e.preventDefault();

                // Add resistance/damping as you pull further
                const dampenedDiff = Math.min(diff * 0.5, maxPullDownDistance);
                setPullChange(dampenedDiff);
            } else {
                setPullChange(0);
            }
        };

        const handleTouchEnd = async () => {
            if (!isPulling.current) return;
            isPulling.current = false;

            if (pullChange >= pullDownThreshold && !refreshing) {
                setRefreshing(true);
                setPullChange(60); // Keep it visible while refreshing
                try {
                    await onRefresh();
                } finally {
                    setRefreshing(false);
                    setPullChange(0);
                }
            } else {
                setPullChange(0);
            }
        };

        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [pullChange, refreshing, onRefresh, pullDownThreshold, maxPullDownDistance]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                minHeight: '100vh',
                touchAction: 'pan-y' // Allow vertical scrolling
            }}
        >
            {/* Refresh Indicator */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: pullChange > 0 ? pullChange : 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    transition: isPulling.current ? 'none' : 'height 0.3s ease-out',
                    zIndex: 1,
                    pointerEvents: 'none'
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                    {refreshing ? (
                        <CircularProgress size={24} />
                    ) : (
                        <>
                            <RefreshIcon
                                sx={{
                                    transform: `rotate(${pullChange * 2}deg)`,
                                    opacity: Math.min(pullChange / pullDownThreshold, 1)
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {pullChange >= pullDownThreshold ? 'Release to refresh' : 'Pull down'}
                            </Typography>
                        </>
                    )}
                </Box>
            </Box>

            {/* Main Content - Pushed down */}
            <Box
                sx={{
                    transform: `translateY(${Math.max(pullChange, 0)}px)`,
                    transition: isPulling.current ? 'none' : 'transform 0.3s ease-out',
                    willChange: 'transform',
                    position: 'relative',
                    zIndex: 2
                }}
            >
                {children}
            </Box>
        </div>
    );
};

export default PullToRefresh;
