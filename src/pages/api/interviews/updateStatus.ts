import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId, status } = req.body;

  console.log(`Updating session ${sessionId} to status: ${status}`);

  // Optionally update DB
  res.status(200).json({ message: 'Status updated successfully' });
}
