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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import api from '../../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    stock: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchBorrowedBooks();
    fetchAvailableBooks();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const response = await api.get('/admin/borrowed-books');
      setBorrowedBooks(response.data);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    }
  };

  const fetchAvailableBooks = async () => {
    try {
      const response = await api.get('/user/available-books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddBook = async () => {
    try {
      await api.post('/admin/book', newBook);
      setOpenDialog(false);
      setNewBook({
        title: '',
        author: '',
        genre: '',
        description: '',
        stock: 0,
      });
      fetchAvailableBooks();
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await api.delete(`/admin/book/${bookId}`);
      fetchAvailableBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleUpdateStock = async (bookId, change) => {
    try {
      await api.put(`/admin/book/stock/${bookId}?stockChange=${change}`);
      fetchAvailableBooks();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Users" />
            <Tab label="Books" />
            <Tab label="Borrowed Books" />
          </Tabs>
        </Grid>

        {activeTab === 0 && (
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.firstname}</TableCell>
                      <TableCell>{user.lastname}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
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
            <Box sx={{ mb: 2 }}>
              <Button variant="contained" onClick={() => setOpenDialog(true)}>
                Add New Book
              </Button>
            </Box>
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
                          onClick={() => handleUpdateStock(book.id, 1)}
                          sx={{ mr: 1 }}
                        >
                          +
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleUpdateStock(book.id, -1)}
                          sx={{ mr: 1 }}
                        >
                          -
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Book Title</TableCell>
                    <TableCell>Borrowed By</TableCell>
                    <TableCell>Borrowed Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Returned</TableCell>
                    <TableCell>Return Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {borrowedBooks.map((borrowed) => (
                    <TableRow key={borrowed.id}>
                      <TableCell>{borrowed.book.title}</TableCell>
                      <TableCell>{borrowed.user.username}</TableCell>
                      <TableCell>{borrowed.borrowedDate}</TableCell>
                      <TableCell>{borrowed.dueDate}</TableCell>
                      <TableCell>{borrowed.returned ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{borrowed.returnDate || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Book</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Genre"
            value={newBook.genre}
            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            sx={{ mt: 2 }}
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Stock"
            type="number"
            value={newBook.stock}
            onChange={(e) => setNewBook({ ...newBook, stock: parseInt(e.target.value) })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddBook} variant="contained">
            Add Book
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 