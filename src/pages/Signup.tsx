import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Link as MuiLink,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,

} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    roll_number: "",
    branch: "",
    year: 1,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await authService.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        roll_number: formData.roll_number,
        branch: formData.branch,
        year_of_study: Number(formData.year),
      });

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Event Manager
          </Typography>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
  margin="normal"
  required
  fullWidth
  name="password"
  label="Password"
  type={showPassword ? "text" : "password"}
  id="password"
  value={formData.password}
  onChange={handleChange}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowPassword((prev) => !prev)}
          onMouseDown={(e) => e.preventDefault()}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

            <TextField
  margin="normal"
  required
  fullWidth
  name="confirmPassword"
  label="Confirm Password"
  type={showConfirmPassword ? "text" : "password"}
  id="confirmPassword"
  value={formData.confirmPassword}
  onChange={handleChange}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() =>
            setShowConfirmPassword((prev) => !prev)
          }
          onMouseDown={(e) => e.preventDefault()}
          edge="end"
        >
          {showConfirmPassword ? (
            <VisibilityOff />
          ) : (
            <Visibility />
          )}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

            <TextField
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="last_name"
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="roll_number"
              label="USN"
              name="roll_number"
              value={formData.roll_number}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="branch"
              label="Branch"
              placeholder="e.g., Computer Science"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel id="year-label">Year of Study</InputLabel>
              <Select
                labelId="year-label"
                id="year"
                name="year"
                value={formData.year}
                label="Year of Study"
                onChange={handleChange}
              >
                <MenuItem value={1}>1st Year</MenuItem>
                <MenuItem value={2}>2nd Year</MenuItem>
                <MenuItem value={3}>3rd Year</MenuItem>
                <MenuItem value={4}>4th Year</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <MuiLink component={Link} to="/login" variant="body2">
                Already have an account? Login
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
