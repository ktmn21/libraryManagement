import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Welcome to Our Library
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Discover thousands of books and manage your reading journey with us.
        </Typography>
        
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Welcome; 