import express, { Request, Response } from 'express';
import { streamHandler } from './streamHandler';

const router = express.Router();

router.post('/start-stream', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }
  try {
    const localUrl = await streamHandler.startStream({ url });
    res.json({ localUrl });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to start stream', details: error.message });
  }
});

export default router;
