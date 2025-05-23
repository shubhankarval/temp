import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.post('/api/chat', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const words = ['Hello', 'this', 'is', 'a', 'streaming', 'response'];
  let i = 0;

  const interval = setInterval(() => {
    if (i >= words.length) {
      clearInterval(interval);
      res.write(`event: done\n\n`);
      res.end();
      return;
    }
    res.write(`data: ${words[i++]}\n\n`);
  }, 400);
});

app.listen(3001, () => console.log('✅ Server running at http://localhost:3001'));
