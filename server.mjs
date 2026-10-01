import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY تنظیم نشده");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    name: "Minecraft AI Bridge"
  });
});

app.post("/ask", async (req, res) => {
  try {
    const message = String(req.body.message || "").trim();

    if (!message) {
      return res.status(400).json({
        error: "پیامی ارسال نشده"
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5.6",
      input: `You are an AI assistant connected to Minecraft Bedrock.
Player says: ${message}`
    });

    res.json({
      success: true,
      answer: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "AI request failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Minecraft AI Bridge running on port ${PORT}`);
});
