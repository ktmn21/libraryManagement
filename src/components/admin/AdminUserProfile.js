import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const AdminUserProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    if (userProfile?.username) {
      fetchUserBorrowedBooks();
    }
  }, [userProfile]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/admin/get-user-profile/${userId}`);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserBorrowedBooks = async () => {
    try {
      const response = await api.get(`/admin/borrowed-books/${userProfile?.username}`);
      setBorrowedBooks(response.data);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/admin')}
        sx={{ mb: 3 }}
      >
        Back to Users List
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab label="User Information" />
            <Tab label="Borrowed Books" />
          </Tabs>
        </Grid>

        {activeTab === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography><strong>First Name:</strong> {userProfile?.firstname}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Last Name:</strong> {userProfile?.lastname}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Username:</strong> {userProfile?.username}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Role:</strong> {userProfile?.role}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Borrowed Books
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Book Title</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Borrowed Date</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {borrowedBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.book.title}</TableCell>
                        <TableCell>{book.book.author}</TableCell>
                        <TableCell>{new Date(book.borrowedDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(book.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{book.returned ? 'Returned' : 'Borrowed'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default AdminUserProfile; 