import { createTheme, alpha } from "@mui/material/styles";

// Premium Color Palette
const primaryColor = "#6366f1"; // Indigo 500
const secondaryColor = "#06b6d4"; // Cyan 500
const successColor = "#10b981";
const warningColor = "#f59e0b";
const errorColor = "#ef4444";
const backgroundDefault = "#f8fafc";
const paperColor = "#ffffff";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: primaryColor,
            light: "#818cf8",
            dark: "#4f46e5",
            contrastText: "#ffffff",
        },
        secondary: {
            main: secondaryColor,
            light: "#67e8f9", // Cyan 300
            dark: "#0891b2", // Cyan 700
            contrastText: "#ffffff",
        },
        success: {
            main: successColor,
        },
        warning: {
            main: warningColor,
        },
        error: {
            main: errorColor,
        },
        background: {
            default: backgroundDefault,
            paper: paperColor,
        },
        text: {
            primary: "#1e293b", // Slate 800
            secondary: "#64748b", // Slate 500
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: "2.5rem",
            lineHeight: 1.2,
            letterSpacing: "-0.01562em",
        },
        h2: {
            fontWeight: 700,
            fontSize: "2rem",
            lineHeight: 1.2,
            letterSpacing: "-0.00833em",
        },
        h3: {
            fontWeight: 600,
            fontSize: "1.75rem",
            lineHeight: 1.2,
            letterSpacing: "0em",
        },
        h4: {
            fontWeight: 600,
            fontSize: "1.5rem",
            lineHeight: 1.2,
            letterSpacing: "0.00735em",
        },
        h5: {
            fontWeight: 600,
            fontSize: "1.25rem",
            lineHeight: 1.2,
            letterSpacing: "0em",
        },
        h6: {
            fontWeight: 600,
            fontSize: "1rem",
            lineHeight: 1.2,
            letterSpacing: "0.0075em",
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    padding: "8px 16px",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    },
                },
                containedPrimary: {
                    background: `linear-gradient(45deg, ${primaryColor} 30%, #4f46e5 90%)`,
                },
                containedSecondary: {
                    background: `linear-gradient(45deg, ${secondaryColor} 30%, #0891b2 90%)`,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha(paperColor, 0.8),
                    backdropFilter: "blur(12px)",
                    color: "#1e293b",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
    },
});

export default theme;
