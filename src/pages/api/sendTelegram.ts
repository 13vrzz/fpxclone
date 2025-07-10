import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  const token = '8165418740:AAHKjz_zlJ0yAsIWz6jyteqwdpZxfWNfkvo';   // Replace with your bot token
  const chatId = '7544292494';    // Replace with your chat ID

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    const data = await response.json();

    if (!data.ok) return res.status(500).json({ error: data.description });

    res.status(200).json({ message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
