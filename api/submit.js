
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const { username, uid, facebookName, phone } = req.body;

    if (!username || !uid || !facebookName || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!/^[0-9]{10}$/.test(String(phone))) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number"
      });
    }

    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram environment variables missing");

      return res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
    }

    const telegramMessage = `🎮 NEW TOURNAMENT REGISTRATION

━━━━━━━━━━━━━━

👤 Username:
${username}

🆔 UID:
${uid}

📘 Facebook Name:
${facebookName}

📱 Phone:
${phone}

━━━━━━━━━━━━━━
✅ New player registration received`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage
        })
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      console.error("Telegram API error:", telegramResult);

      return res.status(500).json({
        success: false,
        message: "Telegram notification failed"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registration submitted successfully"
    });

  } catch (error) {
    console.error("Submit API error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
