import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Link, 
  CircularProgress,
  Alert,
  Grid,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const navigate = useNavigate();
  const { register, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = ['Account Information', 'Personal Details', 'Confirmation'];

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      agreeToTerms: false
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
      firstName: Yup.string()
        .required('First name is required'),
      lastName: Yup.string()
        .required('Last name is required'),
      agreeToTerms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setRegisterError('');
      clearError();
      
      const result = await register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName
      });
      
      if (result.success) {
        navigate('/');
      } else {
        setRegisterError(result.error || 'Registration failed. Please try again.');
      }
      
      setLoading(false);
    }
  });

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate first step fields
      const errors = {};
      if (!formik.values.email) errors.email = 'Email is required';
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formik.values.email)) {
        errors.email = 'Invalid email address';
      }
      if (!formik.values.password) errors.password = 'Password is required';
      else if (formik.values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      if (!formik.values.confirmPassword) errors.confirmPassword = 'Confirm password is required';
      else if (formik.values.password !== formik.values.confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
      }
      
      if (Object.keys(errors).length > 0) {
        formik.setTouched({
          email: true,
          password: true,
          confirmPassword: true
        });
        formik.setErrors(errors);
        return;
      }
    } else if (activeStep === 1) {
      // Validate second step fields
      const errors = {};
      if (!formik.values.firstName) errors.firstName = 'First name is required';
      if (!formik.values.lastName) errors.lastName = 'Last name is required';
      
      if (Object.keys(errors).length > 0) {
        formik.setTouched({
          firstName: true,
          lastName: true
        });
        formik.setErrors(errors);
        return;
      }
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
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
            
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              disabled={loading}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              variant="outlined"
              margin="normal"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              variant="outlined"
              margin="normal"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              disabled={loading}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {formik.values.email}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">
                  {formik.values.firstName} {formik.values.lastName}
                </Typography>
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              By clicking "Create Account", you agree to our Terms of Service and Privacy Policy.
            </Alert>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Create Your Account
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Start your child's confidence building journey
      </Typography>
      
      {registerError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {registerError}
        </Alert>
      )}
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <form onSubmit={formik.handleSubmit}>
        {getStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={loading}
            >
              Next
            </Button>
          )}
        </Box>
      </form>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" variant="body2">
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
