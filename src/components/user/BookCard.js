import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';

const BookCard = ({ book, onBorrow, showBorrowButton = true }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={`https://picsum.photos/seed/${book.id}/200/300`} // Placeholder image
        alt={book.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {book.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          By {book.author}
        </Typography>
        <Typography variant="subtitle2" color="primary">
          {book.genre}
        </Typography>
        {book.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {book.description}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Available: {book.stock} copies
          </Typography>
        </Box>
        {showBorrowButton && book.stock > 0 && (
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => onBorrow(book.id)}
          >
            Borrow
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BookCard; 