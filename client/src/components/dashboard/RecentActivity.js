import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import { format } from 'date-fns';

const RecentActivity = ({ activities }) => {
  // If no activities provided, use sample data
  const activityData = activities || [
    {
      _id: '1',
      type: 'activity',
      title: 'Morning Routine Checklist',
      date: new Date(),
      pillarName: 'Independence & Problem-Solving',
      childReaction: 'positive'
    },
    {
      _id: '2',
      type: 'challenge',
      title: 'Let your child order their own food',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      pillarName: 'Independence & Problem-Solving',
      childReaction: 'neutral'
    },
    {
      _id: '3',
      type: 'activity',
      title: 'The "Power of Yet" Journal',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      pillarName: 'Growth Mindset & Resilience',
      childReaction: 'positive'
    }
  ];
  
  const getReactionColor = (reaction) => {
    switch(reaction) {
      case 'positive':
        return 'success';
      case 'neutral':
        return 'info';
      case 'negative':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getReactionLabel = (reaction) => {
    switch(reaction) {
      case 'positive':
        return 'Positive';
      case 'neutral':
        return 'Neutral';
      case 'negative':
        return 'Challenging';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activities
        </Typography>
        
        <List sx={{ width: '100%' }}>
          {activityData.map((activity, index) => (
            <React.Fragment key={activity._id}>
              {index > 0 && <Divider component="li" />}
              <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" component="span">
                        {activity.title}
                      </Typography>
                      <Chip 
                        label={activity.type === 'challenge' ? 'Challenge' : 'Activity'} 
                        size="small"
                        color={activity.type === 'challenge' ? 'secondary' : 'primary'}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {activity.pillarName}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {format(new Date(activity.date), 'MMM d, yyyy')}
                        </Typography>
                        <Chip 
                          label={getReactionLabel(activity.childReaction)} 
                          size="small"
                          color={getReactionColor(activity.childReaction)}
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
