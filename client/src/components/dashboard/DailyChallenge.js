import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, CircularProgress, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DailyChallenge = ({ childId }) => {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    const fetchDailyChallenge = async () => {
      if (!childId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/challenges/current?childId=${childId}`);
        setChallenge(response.data);
        setCompleted(response.data.completed || false);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching daily challenge:', error);
        setLoading(false);
      }
    };
    
    fetchDailyChallenge();
  }, [childId]);
  
  const handleCompleteChallenge = async () => {
    try {
      await axios.post(`/api/progress/${childId}/challenges/${challenge._id}`, {
        completed: true
      });
      setCompleted(true);
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };
  
  const handleViewDetails = () => {
    navigate(`/challenge/${challenge._id}`);
  };
  
  if (loading) {
    return (
      <Card sx={{ height: '100%', minHeight: 200 }}>
        <CardContent sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }
  
  if (!challenge) {
    return (
      <Card sx={{ height: '100%', minHeight: 200 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Daily Challenge
          </Typography>
          <Typography variant="body1">
            No challenge available for today. Please check back later.
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Today's Challenge
          </Typography>
          <Chip 
            label={`Day ${challenge.day}`} 
            color="secondary" 
            size="small" 
          />
        </Box>
        
        <Typography variant="subtitle1" color="primary.main" gutterBottom>
          {challenge.title}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {challenge.description}
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Age-Appropriate Adaptation:
        </Typography>
        
        <Typography variant="body2" paragraph>
          {challenge.ageAdaptations?.elementary?.description || challenge.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleCompleteChallenge}
            disabled={completed}
          >
            {completed ? 'Completed' : 'Mark Complete'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DailyChallenge;
