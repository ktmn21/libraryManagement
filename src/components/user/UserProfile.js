import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    username: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchBorrowedBooks();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setUserProfile(response.data);
      setProfileData({
        firstname: response.data.firstname,
        lastname: response.data.lastname,
        username: response.data.username,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const response = await api.get('/user/borrowed');
      setBorrowedBooks(response.data);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put('/user/profile', profileData);
      setEditMode(false);
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleReturn = async (borrowedBookId) => {
    try {
      await api.post(`/user/return/${borrowedBookId}`);
      fetchBorrowedBooks();
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/user')}
        sx={{ mb: 3 }}
      >
        Back to Books
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab label="Profile Information" />
            <Tab label="Borrowed Books" />
          </Tabs>
        </Grid>

        {/* Profile Information Section */}
        {activeTab === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              {!editMode ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Profile Information
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
                      <Button 
                        variant="contained" 
                        onClick={() => setEditMode(true)}
                        sx={{ mt: 2 }}
                      >
                        Edit Profile
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Edit Profile
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={profileData.firstname}
                        onChange={(e) => setProfileData({ ...profileData, firstname: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={profileData.lastname}
                        onChange={(e) => setProfileData({ ...profileData, lastname: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                        variant="contained" 
                        onClick={handleUpdateProfile}
                        sx={{ mr: 1 }}
                      >
                        Save Changes
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>
        )}

        {/* Borrowed Books Section */}
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
                      <TableCell>Actions</TableCell>
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
                        <TableCell>
                          {!book.returned && (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleReturn(book.id)}
                            >
                              Return Book
                            </Button>
                          )}
                        </TableCell>
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

export default UserProfile; 