export async function sendTelegramNotification(message: string) {
  const botToken = import.meta.env.VITE_TG_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TG_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram bot credentials not found in environment variables");
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (err) {
    console.error("Failed to send telegram message", err);
  }
}
