import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. Add it to .env before testing.");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json({ limit: "100kb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

const systemPrompt = `
You are the AI assistant embedded in the Human+AI Decision Framework pilot.
Your role is to help the participant analyze the scenario they are given.

Rules:
- Do not mention or teach the Human+AI Decision Framework unless the participant explicitly asks.
- Do not coach the participant on how to "pass" the pilot.
- Answer the participant's actual question normally and professionally.
- Make uncertainty explicit.
- Distinguish facts, assumptions, estimates, and unknowns when relevant.
- For decisions, consider alternatives, risks, downside scenarios, and what additional information would change the recommendation.
- Do not request sensitive personal information.
- Keep answers useful but reasonably concise.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], participantCode = "", phase = "" } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    const safeHistory = Array.isArray(history)
      ? history.slice(-10).filter(x => x && typeof x.content === "string")
      : [];

    const input = [
      { role: "system", content: systemPrompt },
      ...safeHistory.map(x => ({ role: x.role === "assistant" ? "assistant" : "user", content: x.content })),
      { role: "user", content: message }
    ];

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input
    });

    res.json({
      text: response.output_text || "No response returned.",
      meta: {
        participantCode: String(participantCode).slice(0, 64),
        phase: String(phase).slice(0, 64)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed." });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
  console.log(`Human+AI pilot chat running on http://localhost:${port}`);
});
