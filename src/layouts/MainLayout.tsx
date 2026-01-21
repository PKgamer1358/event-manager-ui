import React from "react";
import { Box, Container, Fade } from "@mui/material";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom"; // Use Outlet if we use Layout Routes, or just children

interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                bgcolor: "background.default",
            }}
        >
            <Navbar />
            <Container
                component="main"
                maxWidth="xl"
                sx={{
                    flexGrow: 1,
                    py: 4,
                    px: { xs: 2, md: 4 },
                }}
            >
                <Fade in={true} timeout={500}>
                    <Box>{children}</Box>
                </Fade>
            </Container>

            {/* Footer could go here */}
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: "auto",
                    backgroundColor: (theme) => theme.palette.grey[100],
                    textAlign: "center",
                }}
            >
            </Box>
        </Box>
    );
};

export default MainLayout;
