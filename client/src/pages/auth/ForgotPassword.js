import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Link, 
  CircularProgress,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required')
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        
        // In a real application, this would call an API endpoint
        await axios.post('/api/auth/forgot-password', { email: values.email });
        
        setSubmitted(true);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'An error occurred. Please try again.');
        setLoading(false);
      }
    }
  });

  return (
    <Box>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Reset Password
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Enter your email address and we'll send you instructions to reset your password
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {submitted ? (
        <Box>
          <Alert severity="success" sx={{ mb: 3 }}>
            If an account exists with the email you provided, you will receive password reset instructions.
          </Alert>
          <Button
            component={RouterLink}
            to="/login"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Return to Login
          </Button>
        </Box>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mt: 3, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Reset Instructions'}
          </Button>
        </form>
      )}
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2">
          Remember your password?{' '}
          <Link component={RouterLink} to="/login" variant="body2">
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
