import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  sessionId: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  experienceLevel: string;
}

const initialState: SessionState = {
  sessionId: '',
  name: '',
  email: '',
  phone: '',
  topic: '',
  experienceLevel: '',
};

const interviewSessionSlice = createSlice({
  name: 'interviewSession',
  initialState,
  reducers: {
    setSessionInfo: (state, action: PayloadAction<SessionState>) => {
      return { ...action.payload };
    },
  },
});

export const { setSessionInfo } = interviewSessionSlice.actions;
export default interviewSessionSlice.reducer;
