import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  TextField,
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const ChildProfile = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    ageGroup: 'elementary',
    strengths: [],
    interests: [],
    notes: ''
  });
  const [newStrength, setNewStrength] = useState('');
  const [newInterest, setNewInterest] = useState('');
  
  const isNewChild = childId === 'new';
  
  useEffect(() => {
    if (isNewChild) {
      setLoading(false);
      setEditing(true);
      return;
    }
    
    const fetchChildProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/children/${childId}`);
        setChild(response.data);
        
        // Initialize form data
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          dateOfBirth: format(new Date(response.data.dateOfBirth), 'yyyy-MM-dd'),
          ageGroup: response.data.ageGroup,
          strengths: response.data.strengths || [],
          interests: response.data.interests || [],
          notes: response.data.notes || ''
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching child profile:', error);
        setLoading(false);
      }
    };
    
    fetchChildProfile();
  }, [childId, isNewChild]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleEditToggle = () => {
    setEditing(!editing);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAddStrength = () => {
    if (newStrength.trim() && !formData.strengths.includes(newStrength.trim())) {
      setFormData({
        ...formData,
        strengths: [...formData.strengths, newStrength.trim()]
      });
      setNewStrength('');
    }
  };
  
  const handleRemoveStrength = (strength) => {
    setFormData({
      ...formData,
      strengths: formData.strengths.filter(s => s !== strength)
    });
  };
  
  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };
  
  const handleRemoveInterest = (interest) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    });
  };
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const childData = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth)
      };
      
      let response;
      
      if (isNewChild) {
        response = await axios.post('/api/children', childData);
      } else {
        response = await axios.put(`/api/children/${childId}`, childData);
      }
      
      setChild(response.data);
      setEditing(false);
      setLoading(false);
      
      if (isNewChild) {
        navigate(`/child/${response.data._id}`);
      }
    } catch (error) {
      console.error('Error saving child profile:', error);
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    if (isNewChild) {
      navigate('/');
    } else {
      setFormData({
        firstName: child.firstName,
        lastName: child.lastName,
        dateOfBirth: format(new Date(child.dateOfBirth), 'yyyy-MM-dd'),
        ageGroup: child.ageGroup,
        strengths: child.strengths || [],
        interests: child.interests || [],
        notes: child.notes || ''
      });
      setEditing(false);
    }
  };
  
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const getAgeGroupLabel = (ageGroup) => {
    switch(ageGroup) {
      case 'toddler':
        return 'Toddler (2-5)';
      case 'elementary':
        return 'Elementary (6-11)';
      case 'teen':
        return 'Teen (12+)';
      default:
        return ageGroup;
    }
  };
  
  if (loading && !isNewChild) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {isNewChild ? 'Create Child Profile' : (editing ? 'Edit Profile' : `${child?.firstName}'s Profile`)}
        </Typography>
        {!isNewChild && !editing && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleEditToggle}
          >
            Edit Profile
          </Button>
        )}
      </Box>
      
      {editing ? (
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Age Group"
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                >
                  <MenuItem value="toddler">Toddler (2-5)</MenuItem>
                  <MenuItem value="elementary">Elementary (6-11)</MenuItem>
                  <MenuItem value="teen">Teen (12+)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Strengths
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {formData.strengths.map((strength, index) => (
                    <Chip 
                      key={index} 
                      label={strength} 
                      onDelete={() => handleRemoveStrength(strength)} 
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Add Strength"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddStrength()}
                    size="small"
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleAddStrength}
                    disabled={!newStrength.trim()}
                  >
                    Add
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Interests
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {formData.interests.map((interest, index) => (
                    <Chip 
                      key={index} 
                      label={interest} 
                      onDelete={() => handleRemoveInterest(interest)} 
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Add Interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                    size="small"
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleAddInterest}
                    disabled={!newInterest.trim()}
                  >
                    Add
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!formData.firstName || !formData.lastName || !formData.dateOfBirth}
                  >
                    {isNewChild ? 'Create Profile' : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar
                    src={child?.avatar}
                    alt={child?.firstName}
                    sx={{ width: 120, height: 120 }}
                  />
                </Grid>
                <Grid item xs={12} md={9}>
                  <Typography variant="h5" gutterBottom>
                    {child?.firstName} {child?.lastName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {calculateAge(child?.dateOfBirth)} years old • {getAgeGroupLabel(child?.ageGroup)}
                  </Typography>
                  
                  {child?.currentPillar && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Current Focus:
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {child.currentPillar.pillarName || 'Pillar Name'}
                      </Typography>
                      <Box sx={{ mt: 1, mb: 1, width: '100%', backgroundColor: 'grey.200', borderRadius: 1, height: 8 }}>
                        <Box
                          sx={{
                            width: `${child.currentPillar.completionPercentage}%`,
                            backgroundColor: 'primary.main',
                            height: '100%',
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {child.currentPillar.completionPercentage}% complete
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      onClick={() => navigate(`/progress/${child?._id}`)}
                    >
                      View Progress
                    </Button>
                    <Button 
                      variant="outlined"
                      onClick={() => navigate(`/challenges?childId=${child?._id}`)}
                    >
                      View Challenges
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
                <Tab label="Overview" />
                <Tab label="Strengths & Interests" />
                <Tab label="Notes" />
              </Tabs>
            </Box>
            
            <Box role="tabpanel" hidden={tabValue !== 0} sx={{ py: 3 }}>
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Recent Activities
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          No recent activities yet.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Upcoming Challenges
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          No upcoming challenges yet.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Box>
            
            <Box role="tabpanel" hidden={tabValue !== 1} sx={{ py: 3 }}>
              {tabValue === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Strengths
                        </Typography>
                        {child?.strengths && child.strengths.length > 0 ? (
                          <Box sx={{ dis<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>