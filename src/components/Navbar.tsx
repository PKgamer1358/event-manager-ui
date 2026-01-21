import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  alpha,
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EventIcon from "@mui/icons-material/Event";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { user, logout, isAuthenticated, isAdmin, isSuperAdmin } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleCloseUserMenu();
  };

  const pages = isAuthenticated
    ? [
      { label: "Events", path: "/events" },
      ...(!isAdmin && !isSuperAdmin
        ? [{ label: "My Registrations", path: "/my-registrations" }]
        : []),
      // If admin, they should go to dashboard, but maybe they want to see event list as user too?
      // Keeping it simple. Admin specific links are in AdminLayout sidebar now. 
      // This Navbar is primarily for "User Mode".
    ]
    : [];

  // If user is admin, add a link to switch to Admin Users
  if (isSuperAdmin && isAuthenticated) {
    pages.push({ label: "Users", path: "/admin/users" });
    pages.push({ label: "All Registrations", path: "/admin/events/registrations" });
  }

  return (
    <AppBar position="sticky" elevation={0} sx={{
      bgcolor: alpha(theme.palette.background.paper, 0.8),
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${theme.palette.divider}`,
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* LOGO DESKTOP */}
          <EventIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate(isAuthenticated ? "/events" : "/")}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: '"Inter", sans-serif',
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "text.primary",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            EVENT<Box component="span" sx={{ color: 'primary.main' }}>MANAGER</Box>
          </Typography>

          {/* MOBILE MENU */}
          {isAuthenticated && (
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="default"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.label}
                    onClick={() => handleNavigation(page.path)}
                  >
                    <Typography textAlign="center">{page.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {/* LOGO MOBILE */}
          <EventIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={() => navigate(isAuthenticated ? "/events" : "/")}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "text.primary",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            EMS
          </Typography>

          {/* DESKTOP NAV LINKS */}
          {isAuthenticated && (
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 1 }}>
              {pages.map((page) => {
                const isActive = location.pathname === page.path;
                return (
                  <Button
                    key={page.label}
                    onClick={() => handleNavigation(page.path)}
                    sx={{
                      my: 2,
                      color: isActive ? 'primary.main' : 'text.secondary',
                      display: "block",
                      fontWeight: isActive ? 600 : 500,
                      backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                        color: 'primary.main'
                      }
                    }}
                  >
                    {page.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* USER SETTINGS */}
          {isAuthenticated ? (
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isAdmin && !isSuperAdmin && (
                <IconButton onClick={() => navigate('/notifications')} sx={{ color: 'text.secondary' }}>
                  <NotificationsIcon />
                </IconButton>
              )}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: `2px solid ${theme.palette.primary.light}` }}>
                  <Avatar alt={user?.username || user?.email} src="/static/images/avatar/2.jpg" sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user?.first_name?.charAt(0).toUpperCase() ||
                      user?.username?.charAt(0).toUpperCase() ||
                      user?.email?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  elevation: 4,
                  sx: { borderRadius: 2, minWidth: 180 }
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user?.username}</Typography>
                  <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                </Box>
                <Divider />
                {!isAdmin && !isSuperAdmin && (
                  <MenuItem onClick={() => handleNavigation("/notifications")}>
                    Notifications
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0, display: 'flex', gap: 2 }}>
              <Button color="inherit" onClick={() => navigate("/login")} sx={{ color: 'text.primary', fontWeight: 600 }}>
                Log in
              </Button>
              <Button variant="contained" onClick={() => navigate("/signup")} sx={{ borderRadius: 50, px: 3 }}>
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
