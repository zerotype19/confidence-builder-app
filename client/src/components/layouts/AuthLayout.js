import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, CssBaseline, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AuthLayout = () => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        backgroundColor: theme.palette.primary.light,
        backgroundImage: 'linear-gradient(135deg, rgba(74, 109, 167, 0.8) 0%, rgba(249, 168, 38, 0.8) 100%)',
      }}
    >
      <CssBaseline />
      <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            width: '100%', 
            borderRadius: 3,
            my: 4
          }}
        >
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
