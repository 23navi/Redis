import { createClient } from 'redis';
import nodemailer from 'nodemailer';

const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis error:', err));

const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',  // Replace with your SMTP server
    port: 587,
    secure: false,
    auth: {
        user: 'your@email.com',
        pass: 'password'
    }
});

async function main() {
    await redisClient.connect();

    try {
        await redisClient.xGroupCreate('email_stream', 'mail_group', '0', { MKSTREAM: true });
    } catch (e: any) {
        if (!e.message.includes('BUSYGROUP')) {
            console.error(e);
            return;
        }
    }

    console.log('Worker started, waiting for messages...');

    while (true) {
        const result = await redisClient.xReadGroup(
            'mail_group',
            'worker-1',
            { key: 'email_stream', id: '>' },
            { BLOCK: 5000, COUNT: 1 }
        )

        if (!result || !Array.isArray(result)) continue;


        for (const stream of result) {
            for (const [id, message] of stream?.messages) {
                const { to, subject, text } = message;

                try {
                    await transporter.sendMail({
                        from: '"Your Service" <no-reply@example.com>',
                        to,
                        subject,
                        text
                    });

                    console.log(`Email sent to ${to}`);
                    await redisClient.xAck('email_stream', 'mail_group', id);
                } catch (e) {
                    console.error(`Failed to send email to ${to}:`, e);
                }
            }
        }
    }
}

main();
