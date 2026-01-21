import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TableContainer,
  Paper,
  CircularProgress
} from "@mui/material";
import { adminService } from "../services/authService";
import { User } from "../types";
import { useAuth } from "../context/AuthContext";

import PageHeader from "../components/PageHeader";

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const { user: currentUser } = useAuth();

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleActivate = async (id: number) => {
    await adminService.activateUser(id);
    loadUsers();
  };

  const handleDeactivate = async (id: number) => {
    await adminService.deactivateUser(id);
    loadUsers();
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const yearMatch =
        yearFilter === "all" || String(u.year_of_study) === yearFilter;

      const branchMatch =
        branchFilter === "all" || u.branch === branchFilter;

      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && u.is_active) ||
        (statusFilter === "pending" && !u.is_active);

      return yearMatch && branchMatch && statusMatch;
    });
  }, [users, yearFilter, branchFilter, statusFilter]);

  const years = Array.from(
    new Set(users.map((u) => u.year_of_study).filter(Boolean))
  );

  const branches = Array.from(
    new Set(users.map((u) => u.branch).filter(Boolean))
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Box>
      <PageHeader
        title="User Management"
        subtitle="Manage student accounts and access permissions."
      />

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems="center"
        >
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={yearFilter}
              label="Year"
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {years.map((y) => (
                <MenuItem key={y} value={String(y)}>
                  Year {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Branch</InputLabel>
            <Select
              value={branchFilter}
              label="Branch"
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {branches.map((b) => (
                <MenuItem key={b} value={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Table */}
      <Card sx={{ minWidth: "fit-content" }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer
            component={Paper}
            sx={{ overflowX: "auto", width: "100%" }}
          >
            <Table sx={{ minWidth: 900 }} stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><b>Username</b></TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <b>Email</b>
                  </TableCell>
                  <TableCell><b>Year</b></TableCell>
                  <TableCell><b>Branch</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell align="right"><b>Action</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.username}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {user.email}
                    </TableCell>
                    <TableCell>{user.year_of_study || "-"}</TableCell>
                    <TableCell>{user.branch || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.is_active ? "Active" : "Inactive"}
                        color={user.is_active ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {user.id === currentUser?.id ? (
                        <Chip label="You" size="small" />
                      ) : user.is_active ? (
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => handleDeactivate(user.id)}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          color="success"
                          variant="contained"
                          onClick={() => handleActivate(user.id)}
                        >
                          Activate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminUsers;

