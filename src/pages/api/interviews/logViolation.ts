import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId, reason } = req.body;

  console.log(`Violation logged for session ${sessionId}: ${reason}`);

  // Optionally save to DB
  res.status(200).json({ message: 'Violation logged successfully' });
}
