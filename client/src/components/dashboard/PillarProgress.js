import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const PillarProgress = ({ childId }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPillarProgress = async () => {
      if (!childId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/progress/${childId}/pillars`);
        setProgress(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pillar progress:', error);
        setLoading(false);
      }
    };
    
    fetchPillarProgress();
  }, [childId]);
  
  if (loading) {
    return (
      <Card sx={{ height: '100%', minHeight: 200 }}>
        <CardContent sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }
  
  // If no data, show sample data
  const pillarData = progress || [
    { pillarName: 'Independence', completionPercentage: 75, color: '#4a6da7' },
    { pillarName: 'Growth Mindset', completionPercentage: 60, color: '#f9a826' },
    { pillarName: 'Social Confidence', completionPercentage: 40, color: '#66bb6a' },
    { pillarName: 'Purpose & Strength', completionPercentage: 25, color: '#29b6f6' },
    { pillarName: 'Managing Fear', completionPercentage: 10, color: '#ef5350' }
  ];
  
  const chartData = {
    labels: pillarData.map(p => p.pillarName),
    datasets: [
      {
        data: pillarData.map(p => p.completionPercentage),
        backgroundColor: pillarData.map(p => p.color),
        borderColor: pillarData.map(p => p.color),
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}% complete`;
          }
        }
      }
    },
    cutout: '70%'
  };
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Confidence Pillars Progress
        </Typography>
        
        <Box sx={{ height: 250, position: 'relative', my: 2 }}>
          <Doughnut data={chartData} options={chartOptions} />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" color="primary.main">
              {Math.round(pillarData.reduce((acc, curr) => acc + curr.completionPercentage, 0) / pillarData.length)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overall
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PillarProgress;
