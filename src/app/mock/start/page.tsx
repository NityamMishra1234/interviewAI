'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSessionInfo } from '@/store/slice/interviewSessionSlice';
import {
  TextField, Button, MenuItem, Box, Typography, Stack,
  Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navigation/navbar';
import Footer from '@/components/footer/Footer';
const topics = ['React', 'Node.js', 'Communication Skills', 'Marketing','python' ,'java','javaScript' , 'MBA' , 'UPSC' , 'AI' ,'ML' , 'BPO','Digigtal Marketing' ];
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

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions before proceeding.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        dispatch(setSessionInfo({ ...formData, sessionId: data.sessionId }));
        router.push('/mock/interview');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-r from-fuchsia-950 via-zinc-900 to-black text-white pb-10">
      <Navbar />
      <Box className="text-center py-3 bg-yellow-500 text-black font-semibold mb-10">
        🚧 This is a beta test version. Use only for testing purposes. The full version will be available soon!
      </Box>
      <Box maxWidth="sm" mx="auto" mt={6} p={4} className="bg-white bg-opacity-10 rounded-xl shadow-xl">
        <Typography variant="h4" gutterBottom align="center" className="text-white">
          Start Your Mock Interview
        </Typography>
        <Stack spacing={3}>
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: 'black' } }}
            InputProps={{ style: { color: 'black' } }}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: 'black' } }}
            InputProps={{ style: { color: 'black' } }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: 'black' } }}
            InputProps={{ style: { color: 'black' } }}
          />
          <TextField
            select
            label="Topic"
            name="topic"
            value={formData.topic}
            onChange={handleSelectChange}
            fullWidth
            InputLabelProps={{ style: { color: 'black' } }}
            InputProps={{ style: { color: 'black' } }}
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
            InputLabelProps={{ style: { color: 'black' } }}
            InputProps={{ style: { color: 'black' } }}
          >
            {levels.map(level => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                checked={acceptedTerms}
                onChange={e => setAcceptedTerms(e.target.checked)}
                style={{ color: 'black' }}
              />
            }
            label={
              <span style={{ color: 'black' }}>
                I accept the{' '}
                <span
                  onClick={() => setTermsOpen(true)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  terms and conditions
                </span>
              </span>
            }
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!acceptedTerms || loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Creating Interview...' : 'Start Interview'}
          </Button>
        </Stack>
      </Box>

      {/* Terms and Conditions Modal */}
      <Dialog open={termsOpen} onClose={() => setTermsOpen(false)}>
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Welcome to InterviewAI! By starting a mock interview, you agree to the use of your voice, session data,
            and answers for testing and improvement purposes only during this beta phase.
            <br /><br />
            We do not store personal answers or question data after the interview ends. Please use this service
            only for testing, not for real job preparation at this stage.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTermsOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </Box>
  );
}
