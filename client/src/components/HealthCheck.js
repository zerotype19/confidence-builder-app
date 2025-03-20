import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const HealthCheck = () => {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h6" color="success.main">
        API is running
      </Typography>
    </Box>
  );
};

export default HealthCheck;
