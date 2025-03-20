import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Avatar, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ChildProfileCard = ({ child }) => {
  const navigate = useNavigate();
  
  // Calculate age from date of birth
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
  
  const handleViewProfile = () => {
    navigate(`/child/${child._id}`);
  };
  
  const handleViewProgress = () => {
    navigate(`/progress/${child._id}`);
  };
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={child.avatar}
            alt={child.firstName}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Box>
            <Typography variant="h6" component="div">
              {child.firstName} {child.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {calculateAge(child.dateOfBirth)} years old
            </Typography>
            <Chip 
              label={getAgeGroupLabel(child.ageGroup)} 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
        
        {child.currentPillar && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Current Focus:
            </Typography>
            <Typography variant="body1">
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
        
        {child.strengths && child.strengths.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Strengths:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
              {child.strengths.map((strength, index) => (
                <Chip key={index} label={strength} size="small" />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button size="small" onClick={handleViewProfile}>View Profile</Button>
        <Button size="small" color="secondary" onClick={handleViewProgress}>Track Progress</Button>
      </CardActions>
    </Card>
  );
};

export default ChildProfileCard;
