import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Tab,
  Tabs,
} from '@mui/material';
import api from '../../services/api';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [books, setBooks] = useState([]);
  const [searchType, setSearchType] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    username: '',
  });

  useEffect(() => {
    fetchAvailableBooks();
    fetchUserProfile();
  }, []);

  const fetchAvailableBooks = async () => {
    try {
      const response = await api.get('/user/available-books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

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

  const handleSearch = async () => {
    try {
      let response;
      switch (searchType) {
        case 'title':
          response = await api.get(`/user/find-books-by-book-title?title=${searchQuery}`);
          break;
        case 'author':
          response = await api.get(`/user/find-books-by-author?author=${searchQuery}`);
          break;
        case 'genre':
          response = await api.get(`/user/find-book-by-genre?genre=${searchQuery}`);
          break;
        default:
          return;
      }
      setBooks(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await api.post(`/user/borrow/${bookId}`);
      fetchAvailableBooks();
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put('/user/profile', profileData);
      setEditProfile(false);
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Available Books" />
            <Tab label="Search Books" />
            <Tab label="Profile" />
          </Tabs>
        </Grid>

        {activeTab === 0 && (
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Genre</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.genre}</TableCell>
                      <TableCell>{book.stock}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          disabled={book.stock === 0}
                          onClick={() => handleBorrow(book.id)}
                        >
                          Borrow
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    fullWidth
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="genre">Genre</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <TextField
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search by ${searchType}...`}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button fullWidth variant="contained" onClick={handleSearch}>
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              {!editProfile ? (
                <>
                  <Typography variant="h6">Profile Information</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography>First Name: {userProfile?.firstname}</Typography>
                    <Typography>Last Name: {userProfile?.lastname}</Typography>
                    <Typography>Username: {userProfile?.username}</Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => setEditProfile(true)}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="h6">Edit Profile</Typography>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profileData.firstname}
                      onChange={(e) =>
                        setProfileData({ ...profileData, firstname: e.target.value })
                      }
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profileData.lastname}
                      onChange={(e) =>
                        setProfileData({ ...profileData, lastname: e.target.value })
                      }
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Username"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({ ...profileData, username: e.target.value })
                      }
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleUpdateProfile}
                      sx={{ mr: 1 }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditProfile(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default UserDashboard; 