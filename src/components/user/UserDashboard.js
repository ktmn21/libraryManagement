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
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
        <IconButton 
          onClick={() => navigate('/user/profile')}
          sx={{ ml: 2 }}
        >
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
    </Container>
  );
};

export default UserDashboard; 