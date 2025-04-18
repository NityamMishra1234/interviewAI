import { configureStore } from '@reduxjs/toolkit';
import interviewSessionReducer from './slice/interviewSessionSlice';
import evaluationReducer from './slice/evaluationSlice';
export const store = configureStore({
  reducer: {
    interviewSession: interviewSessionReducer,
    evaluation: evaluationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
