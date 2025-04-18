// store/slices/evaluationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type EvaluationState = {
    totalScore: number;
    feedback: string;
  };


  const initialState: EvaluationState = {
    totalScore: 0,
    feedback: "",
  };
  


  const evaluationSlice = createSlice({
    name: 'evaluation',
    initialState,
    reducers: {
      setEvaluationData(
        state,
        action: PayloadAction<{ totalScore: number; feedback: string }>
      ) {
        state.totalScore = action.payload.totalScore;
        state.feedback = action.payload.feedback;
      },
      resetEvaluation(state) {
        state.totalScore = 0;
        state.feedback = "";
      },
    },
  });

export const { setEvaluationData, resetEvaluation } = evaluationSlice.actions;
export default evaluationSlice.reducer;
