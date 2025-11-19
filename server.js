import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// --- SECRETS FROM .env ---
const INSTANCE_ID = process.env.INSTANCE_ID;
const TOKEN = process.env.TOKEN;
const AI_BACKEND_URL = process.env.AI_BACKEND_URL;
const BOT_OWNER = process.env.BOT_OWNER || "Owner Not Set";
// -------------------------

// --- MENU CONTENT DEFINITIONS ---

const MAIN_MENU = 
`🌟 *Good Afternoon, Wækë üp tø rëælïty!* 🌟
╭━〔 ⚡ *☬༒M.Î.K-ᴍᴅ༒☬* ⚡ ━⊷
* 👀 𝐔𝐒𝐄𝐑𝐒 : AFGHANI🇦🇫
* 💪 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 : 2400
* 🪞 𝐓𝐘𝐏𝐄 : 𝐍𝐎𝐃𝐄
* 🎒 𝐏𝐋𝐀𝐓𝐅𝐎𝐑𝐌 : 𝕃𝕀ℕ𝕌𝕏 25ℍ2
* 👑 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 : ★[M.Î.K-ᴍᴅ]★
* 🇦🇫 𝐌𝐎𝐃𝐄 : 🍺
* 🕳️ 𝐏𝐑𝐄𝐅𝐈𝐗 : .
* 🕘 𝐓𝐈𝐌𝐄 : 🙇🏿🙇🏿🙇🏿
* ♻️ 𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : 3.0.0
╰━━━━━━━━━━━━━━━━━━━━
🅄 🄻🄸🄺🄴 🄻🄸🄺🄴 🅃🄷🄸🅂 🄱🄾🄾🅃
━━━━━━━━━━━━━━━━━━━━━
╔═ஜ۩░▒▓█ 🅼︎🅴︎🅽︎🆄︎ █▓▒░۩ஜ═╗
┃① ☢️ *Download Menu* (.1 or .download)
┃② ☢️ *Group Menu* (.2 or .group)
┃③ ☢️ *Fun Menu* (.3 or .fun)
┃④ ☢️ *Owner Menu* (.4 or .owner)
┃⑤ ☢️ *AI Menu* (.5 or .ai)
┃⑥ ☢️ *Anime Menu* (.6 or .anime)
┃⑦ ☢️ *Convert Menu* (.7 or .convert)
┃⑧ ☢️ *Other Menu* (.8 or .other)
┃⑨ ☢️ *Reactions Menu* (.9 or .react)
┃⑩ ☢️ *Main Menu* (.10 or .main)
┃⑪ ☢️ *Settings Menu* (.11 or .settings)
┃⑫ ☢️ *Support Menu* (.12 or .support)
┃⑬ ☢️ *Logo Menu* (.13 or .logo)
┃⑭ ☢️ *Ahh Menu* (.14 or .ahh)
┃⑮ ☢️ *Code Menu* (.15 or .code)
╰━━━━━━━━━━━━━━⊷
༺ 🚸𝐀𝐜𝐭𝐨𝐫 / 𝐃𝐚𝐝🚸 ༻

> ☣️❀༒IsRaR-ᴍᴅ༒❀☣️

fσr mσrє ínfσ tчpє *.owner*
> > *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ M.Î.K-ᴍᴅ ᴛᴇᴄʜ 🇦🇫*
`;

const DOWNLOAD_MENU = `*-- ☢️ DOWNLOAD MENU ☢️ --*
To download media, use the following commands:
• *.yt <url>* - Download YouTube video/audio.
• *.ig <url>* - Download Instagram media.
• *.tiktok <url>* - Download TikTok video.
• *.back* - Go back to the Main Menu.
`;

const AI_MENU = `*-- ☢️ AI MENU ☢️ --*
Interact with the AI using:
• *.ai <prompt>* - Ask a question to the AI.
• *.imagine <prompt>* - (Not yet implemented) Generate an image.
• *.back* - Go back to the Main Menu.
`;

const OWNER_MENU = `*-- ☢️ OWNER MENU ☢️ --*
These commands are for the bot owner only:
• *.status* - Check bot uptime and stats.
• *.ownername* - Get Bot Owner's name.
• *.back* - Go back to the Main Menu.
`;

// Placeholder Menu (used for menus 2, 3, 6, 7, 8, 9, 11, 12, 13, 14, 15)
const PLACEHOLDER_MENU = (name) => 
`*-- ☢️ ${name} ☢️ --*
This menu is currently under development!
Check back soon for new commands.
• *.back* - Go back to the Main Menu.
`;


// Middleware to parse incoming JSON data from the webhook
app.use(express.json());

// =========================
// API SEND MESSAGE FUNCTION
// =========================
async function sendMessage(to, text) {
  const url = `https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`;
  
  try {
    await axios.post(url, {
      token: TOKEN,
      to: to, // The number/group ID to reply to
      body: text // The message content
    });
    console.log(`[OUT] Message sent to ${to}`);
  } catch (error) {
    // Log a brief error to keep the console clean
    console.error(`[ERROR] Failed to send message to ${to}: ${error.message}`);
  }
}

// =========================
// WEBHOOK (RECEIVE MESSAGES)
// =========================
app.post('/webhook', async (req, res) => {
    // Ultramsg sends the incoming message data in req.body
    const data = req.body;

    // Check if the message is valid, not a status update, and has a body
    if (data.event_type === 'new_message' && data.data && data.data.body) {
        const messageBody = data.data.body.trim();
        const sender = data.data.from; 
        const command = messageBody.toLowerCase();

        console.log(`[IN] Received from ${sender}: ${messageBody}`);

        // --- COMMAND LOGIC ---

        if (command === '.menu' || command === '.main' || command === '.10') {
            await sendMessage(sender, MAIN_MENU);
        } 
        else if (command === '.1' || command === '.download') {
            await sendMessage(sender, DOWNLOAD_MENU);
        }
        else if (command === '.2' || command === '.group') {
            await sendMessage(sender, PLACEHOLDER_MENU("GROUP MENU"));
        }
        else if (command === '.3' || command === '.fun') {
            await sendMessage(sender, PLACEHOLDER_MENU("FUN MENU"));
        }
        else if (command === '.4' || command === '.owner') {
            await sendMessage(sender, OWNER_MENU);
        }
        else if (command === '.5' || command === '.ai') {
            await sendMessage(sender, AI_MENU);
        }
        else if (command === '.6' || command === '.anime') {
            await sendMessage(sender, PLACEHOLDER_MENU("ANIME MENU"));
        }
        else if (command === '.7' || command === '.convert') {
            await sendMessage(sender, PLACEHOLDER_MENU("CONVERT MENU"));
        }
        else if (command === '.8' || command === '.other') {
            await sendMessage(sender, PLACEHOLDER_MENU("OTHER MENU"));
        }
        else if (command === '.9' || command === '.react') {
            await sendMessage(sender, PLACEHOLDER_MENU("REACTIONS MENU"));
        }
        else if (command === '.11' || command === '.settings') {
            await sendMessage(sender, PLACEHOLDER_MENU("SETTINGS MENU"));
        }
        else if (command === '.12' || command === '.support') {
            await sendMessage(sender, PLACEHOLDER_MENU("SUPPORT MENU"));
        }
        else if (command === '.13' || command === '.logo') {
            await sendMessage(sender, PLACEHOLDER_MENU("LOGO MENU"));
        }
        else if (command === '.14' || command === '.ahh') {
            await sendMessage(sender, PLACEHOLDER_MENU("AHH MENU"));
        }
        else if (command === '.15' || command === '.code') {
            await sendMessage(sender, PLACEHOLDER_MENU("CODE MENU"));
        }
        else if (command === '.back') {
            await sendMessage(sender, MAIN_MENU);
        }
        else if (command.startsWith('.yt ') || command.startsWith('.ig ') || command.startsWith('.tiktok ')) {
            await sendMessage(sender, "⏳ Download command received! (Logic to actually download the media is coming soon.)");
        }
        else if (command.startsWith('.ai ')) {
            const prompt = messageBody.slice(4).trim();
            if (AI_BACKEND_URL && AI_BACKEND_URL !== "https://your-backend-url-here") {
                await sendMessage(sender, "🧠 Thinking...");
                // Placeholder for actual AI interaction
                await sendMessage(sender, `AI functionality is running. You asked: "${prompt}".\n\nTo get a real response, make sure your AI_BACKEND_URL is linked to a working service.`);
            } else {
                await sendMessage(sender, "❌ AI Backend not configured! Please set a valid AI_BACKEND_URL in your .env file.");
            }
        }
        else if (command.startsWith('.')) {
            await sendMessage(sender, "❌ Command not recognized! Type *.menu* for a list of available commands.");
        }
    }

    // IMPORTANT: Acknowledge the webhook with a 200 OK status
    res.sendStatus(200); 
});

// =========================
// SERVER START
// =========================
app.listen(PORT, () => {
    console.log(`🤖 MÎK-MD Bot is running on port ${PORT}!`);
    console.log(`Web server started. Next step: Link the Webhook URL in Ultramsg!`);
});
