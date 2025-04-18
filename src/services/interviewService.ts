import axios from 'axios';

export interface Candidate {
  name: string;
  email: string;
  phone: string;
  topic: string;
  experienceLevel: string;
}

export interface Question {
  id: string;
  question: string;
}

export const fetchInterviewQuestions = async (sessionId: string): Promise<Question[]> => {
  const res = await axios.get(`http://localhost:3000/api/interview/${sessionId}`);
  return res.data.session.responses;
};

export const submitInterview = async (
  sessionId: string,
  candidate: Candidate,
  answers: string[]
): Promise<void> => {
  await axios.post('http://localhost:3000/api/interview/submit', {
    sessionId,
    candidate,
    answers,
  });
};
