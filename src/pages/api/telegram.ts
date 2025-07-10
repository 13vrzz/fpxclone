export default async function handler(req, res) {
  const { data } = req.body;

  const token = '8165418740:AAHKjz_zlJ0yAsIWz6jyteqwdpZxfWNfkvo';
  const chatId = '7544292494';

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: data }),
    });

    const result = await telegramRes.json();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send' });
  }
}
