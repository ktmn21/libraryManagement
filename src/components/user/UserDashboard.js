import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import BookCard from './BookCard';
import api from '../../services/api';

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [userProfile, setUserProfile] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    username: '',
  });

  useEffect(() => {
    fetchAvailableBooks();
    fetchUserProfile();
    fetchBorrowedBooks();
  }, []);

  const fetchAvailableBooks = async () => {
    try {
      const response = await api.get('/user/available-books');
      const sortedBooks = response.data.sort((a, b) => a.genre.localeCompare(b.genre));
      setBooks(sortedBooks);
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

  const fetchBorrowedBooks = async () => {
    try {
      // Assuming there's an endpoint to get user's borrowed books
      const response = await api.get('/user/borrowed-books');
      setBorrowedBooks(response.data);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      fetchAvailableBooks();
      return;
    }
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
      fetchBorrowedBooks();
      setSelectedBook(null);
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const handleReturn = async (borrowedBookId) => {
    try {
      await api.post(`/user/return/${borrowedBookId}`);
      setBorrowedBooks(prevBooks => 
        prevBooks.filter(book => book.id !== borrowedBookId)
      );
      fetchAvailableBooks();
    } catch (error) {
      console.error('Error returning book:', error);
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
      {/* Header with Search and Profile */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, mr: 2 }}>
          <TextField
            select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            sx={{ width: 120 }}
            SelectProps={{ native: true }}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
          </TextField>
          <TextField
            fullWidth
            placeholder={`Search by ${searchType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar>{userProfile?.firstname?.[0] || 'U'}</Avatar>
        </IconButton>
      </Box>

      {/* Books Grid */}
      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <BookCard
              book={book}
              onBorrow={handleBorrow}
            />
          </Grid>
        ))}
      </Grid>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          setShowProfile(true);
          setAnchorEl(null);
        }}>
          My Profile
        </MenuItem>
      </Menu>

      {/* Profile Dialog */}
      <Dialog
        open={showProfile}
        onClose={() => setShowProfile(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          My Profile
        </DialogTitle>
        <DialogContent>
          <Tabs value={editProfile ? 1 : 0}>
            <Tab label="Profile Info" />
            <Tab label="Borrowed Books" />
          </Tabs>

          {!editProfile ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Profile Information</Typography>
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
          ) : (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                value={profileData.firstname}
                onChange={(e) => setProfileData({ ...profileData, firstname: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={profileData.lastname}
                onChange={(e) => setProfileData({ ...profileData, lastname: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Username"
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleUpdateProfile} sx={{ mr: 1 }}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setEditProfile(false)}>
                Cancel
              </Button>
            </Box>
          )}

          {/* Borrowed Books Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Borrowed Books</Typography>
            {borrowedBooks.map((borrowed) => (
              <Paper key={borrowed.id} sx={{ p: 2, mt: 2 }}>
                <Typography variant="subtitle1">{borrowed.book.title}</Typography>
                <Typography variant="body2">Due Date: {borrowed.dueDate}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleReturn(borrowed.id)}
                  sx={{ mt: 1 }}
                >
                  Return Book
                </Button>
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowProfile(false);
            setEditProfile(false);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDashboard; 