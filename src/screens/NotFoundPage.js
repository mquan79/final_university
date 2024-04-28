import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <ErrorOutline style={{ fontSize: 100, color: '#f44336' }} />
      <h1>Error 404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Button component={Link} to="/" variant="contained" color="primary">Go Back to Home</Button>
    </div>
  );
};

export default NotFoundPage;
