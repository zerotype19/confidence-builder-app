import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const ConfidenceQuestion = ({ childId }) => {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    const fetchDailyQuestion = async () => {
      if (!childId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/habits/${childId}/today`);
        if (response.data && response.data.confidenceQuestion) {
          setQuestion(response.data.confidenceQuestion);
          setAnswer(response.data.confidenceQuestion.answer || '');
          setSubmitted(!!response.data.confidenceQuestion.answer);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching confidence question:', error);
        setLoading(false);
      }
    };
    
    fetchDailyQuestion();
  }, [childId]);
  
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    
    try {
      setSubmitting(true);
      await axios.post(`/api/habits/${childId}`, {
        confidenceQuestion: {
          question: question.question,
          answer: answer
        }
      });
      setSubmitted(true);
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting answer:', error);
      setSubmitting(false);
    }
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
  
  if (!question) {
    return (
      <Card sx={{ height: '100%', minHeight: 200 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Daily Confidence Question
          </Typography>
          <Typography variant="body1">
            No question available for today. Please check back later.
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Today's Confidence Question
        </Typography>
        
        <Typography variant="subtitle1" color="primary.main" gutterBottom sx={{ mt: 2 }}>
          {question.question}
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your child's answer"
            variant="outlined"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={submitted}
            placeholder="Record your child's response here..."
          />
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitAnswer}
              disabled={submitting || submitted || !answer.trim()}
            >
              {submitting ? <CircularProgress size={24} /> : submitted ? 'Submitted' : 'Save Answer'}
            </Button>
          </Box>
        </Box>
        
        {submitted && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body2" color="success.dark">
              Answer recorded! Consistent reflection helps build your child's confidence.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ConfidenceQuestion;
