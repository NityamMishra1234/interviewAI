// utils/geminiHelpers.ts
import { genAI } from "./genAIConfig";

export async function generateConversationalQuestions(topic: string, experienceLevel: string): Promise<string[]> {
  const prompt = `
You are a friendly and professional interviewer conducting a mock interview on "${topic}" for a ${experienceLevel}-level candidate.

Generate 10 conversational questions, acknowledging each previous answer briefly and naturally before asking the next question.

Format:
1. "Hi! Please introduce yourself."
2. "Got it, thanks! Now, what motivated you to explore a career in Sales?"
3. "Okay, I got your response, let's move on... How do you handle objections?"

Make it sound human, warm, and realistic.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const questions = text
    .split(/\n\d+\.\s+/)
    .filter((line: string) => line.trim() !== "")
    .map((q: string) => q.trim().replace(/^["“]|["”]$/g, ""));

  return questions;
}




export async function evaluateAnswers(
  qaPairs: { question: string; answer: string }[]
): Promise<{
  totalScore: number;
  feedback: string;
}> {
  if (!qaPairs || !Array.isArray(qaPairs) || qaPairs.length === 0) {
    throw new Error('Invalid or empty answers array.');
  }

  const gradingPrompt = `
You are an interview evaluator AI. You will be given interview questions and a candidate's voice-to-text answers.

Instructions:
- Minor grammar/spelling issues due to speech-to-text are okay.
- Grade each answer out of 10.
- After grading all, give a final total score (sum of all scores).
- Then, write a short final feedback summary covering strengths and areas of improvement.

Return format:
Total Score: X
Feedback: ...
Here are the questions and answers:
`;

  const combined = qaPairs
    .map(
      (pair, i) =>
        `Q${i + 1}: ${pair.question}\nA: ${pair.answer?.trim() || 'No answer given.'}`
    )
    .join('\n\n');

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(`${gradingPrompt}\n\n${combined}`);
    const text = (await result.response).text();

    const scoreMatch = text.match(/Total Score:\s*(\d+)/i);
    const feedbackMatch = text.match(/Feedback:\s*([\s\S]+)/i);

    if (!scoreMatch || !feedbackMatch) {
      console.error('Raw Gemini Output:', text);
      throw new Error('Failed to extract total score or feedback from Gemini response.');
    }

    const totalScore = parseInt(scoreMatch[1]);
    const feedback = feedbackMatch[1].trim();

    if (isNaN(totalScore) || totalScore < 0) {
      throw new Error('Parsed total score is invalid.');
    }

    return { totalScore, feedback };
  } catch (error: unknown) {
    console.error('Error during evaluation:', error);
    throw new Error('Answer evaluation failed.');
  }
}

