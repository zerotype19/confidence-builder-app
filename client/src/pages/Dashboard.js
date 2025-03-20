import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Avatar, 
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ChildProfileCard from '../components/dashboard/ChildProfileCard';
import DailyChallenge from '../components/dashboard/DailyChallenge';
import PillarProgress from '../components/dashboard/PillarProgress';
import RecentActivity from '../components/dashboard/RecentActivity';
import ConfidenceQuestion from '../components/dashboard/ConfidenceQuestion';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch children profiles
        const childrenResponse = await axios.get('/api/children');
        setChildren(childrenResponse.data);
        
        if (childrenResponse.data.length > 0) {
          const activeChild = childrenResponse.data[0];
          
          // Fetch daily challenge
          const challengeResponse = await axios.get(`/api/challenges/current?childId=${activeChild._id}`);
          setDailyChallenge(challengeResponse.data);
          
          // Fetch recent activities
          const activitiesResponse = await axios.get(`/api/progress/${activeChild._id}/recent`);
          setRecentActivities(activitiesResponse.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const handleAddChild = () => {
    navigate('/child/new');
  };
  
  if (loading) {
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
          Welcome, {currentUser?.firstName || 'Parent'}!
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleAddChild}
        >
          Add Child Profile
        </Button>
      </Box>
      
      {children.length === 0 ? (
        <Card sx={{ mb: 4, p: 3, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Let's Get Started!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Create your first child profile to begin the confidence building journey.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleAddChild}
            >
              Create Child Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Child Profiles
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {children.map((child) => (
              <Grid item xs={12} sm={6} md={4} key={child._id}>
                <ChildProfileCard child={child} />
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3,
                  border: '2px dashed',
                  borderColor: 'primary.light',
                  backgroundColor: 'background.paper',
                  cursor: 'pointer'
                }}
                onClick={handleAddChild}
              >
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                  Add Another Child
                </Typography>
                <Button variant="outlined" color="primary">
                  Add Profile
                </Button>
              </Card>
            </Grid>
          </Grid>
          
          {children.length > 0 && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DailyChallenge challenge={dailyChallenge} childId={children[0]._id} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ConfidenceQuestion childId={children[0]._id} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <PillarProgress childId={children[0]._id} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RecentActivity activities={recentActivities} />
                </Grid>
              </Grid>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default Dashboard;
