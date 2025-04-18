'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSessionInfo } from '@/store/slice/interviewSessionSlice';
import { TextField, Button, MenuItem, Box, Typography, Stack } from '@mui/material';

import { useRouter } from 'next/navigation';
const topics = ['React', 'Node.js', 'Communication Skills', 'Marketing'];
const levels = ['beginner', 'intermediate', 'advanced'];

export default function StartInterviewPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: '',
    experienceLevel: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        dispatch(setSessionInfo({ ...formData, sessionId: data.sessionId }));
        // Redirect to the first question page
        router.push('/mock/interview');
        // router.push('/mock/interview')
      }
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  };

  return (
    <Box maxWidth="sm" mx="auto" mt={6}>
      <Typography variant="h4" gutterBottom>
        Start Mock Interview
      </Typography>
      <Stack spacing={3}>
        <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
        <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
        <TextField
          select
          label="Topic"
          name="topic"
          value={formData.topic}
          onChange={handleSelectChange}
          fullWidth
        >
          {topics.map(topic => (
            <MenuItem key={topic} value={topic}>
              {topic}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Experience Level"
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleSelectChange}
          fullWidth
        >
          {levels.map(level => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleSubmit}>
          Start Interview
        </Button>
      </Stack>
    </Box>
  );
}
