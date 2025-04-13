const express = require("express");
const app = express();
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

let PORT = 5500 || process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.API_KEY,
});
app.post("/generate", async (req, res) => {
  let { topic, platform, tone } = req.query;
  const prompt = `Generate 3 caption for a ${platform} post about "${topic}". The tone should be ${tone}.`;
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${prompt}`,
            },
          ],
        },
      ],
    });

    let data = completion.choices[0].message.content;
    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate caption" });
  }
});

app.listen(PORT);
