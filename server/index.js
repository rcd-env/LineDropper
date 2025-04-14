const express = require("express");
const app = express();
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

let PORT = process.env.PORT || 5500;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.API_KEY,
});
app.post("/generate", async (req, res) => {
  let { topic, platform, tone, length } = req.body;
  const prompt = `
You're a professional content strategist.

Based on the following inputs:

- Topic: ${topic}
- Platform: ${platform}
- Tone: ${tone}
- Length: ${length}

Generate:

1. 3 engaging and catchy titles for the content
2. 5 to 7 relevant and trendy hashtags
3. A captivating medium-long description that matches the platform and tone

⚠️ Return your response strictly in this JSON format:

{
  "titles": [
    "Title 1",
    "Title 2",
    "Title 3"
  ],
  "hashtags": [
    "#tag1", "#tag2", "#tag3", "#tag4", "#tag5"
  ],
  "description": "Your well-written description goes here. It should be interesting, tone-specific, and tailored for the platform."
}

`;
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

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate caption" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
