import express, { Request, Response } from 'express';
import { createClient } from 'redis';

const app = express();
const redisClient = createClient();
app.use(express.json());

redisClient.on('error', (err) => console.error('Redis error:', err));


const handleMail = async (req: Request, res: Response) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
        res.status(400).json({ error: 'Missing email fields' });
        return
    }

    const messageId = await redisClient.xAdd('email_stream', '*', {
        to,
        subject,
        text,
    });

    res.status(200).json({ status: 'Queued', id: messageId });
}



async function main() {
    await redisClient.connect();

    app.post('/send-mail', handleMail)

    app.listen(3000, () => console.log('Producer API running on port 3000'));
}

main();




// curl -X POST http://localhost:3000/send-mail \
//   -H "Content-Type: application/json" \
//   -d '{"to": "test@example.com", "subject": "Hello", "text": "This is a test."}'