import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;
const MODEL = "gemini-1.5-flash-latest";

app.post("/chat", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Mensagem vazia." });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
        }),
      }
    );

    const data = await response.json();

    // ✅ Mostra tudo que o Gemini respondeu (ou o erro) no console do Render
    console.log("🌐 Resposta completa do Gemini:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "🤖 O Gemini não enviou texto. Veja o log no Render para detalhes.";

    res.json({ reply });
  } catch (error) {
    console.error("⚠️ Erro ao chamar o Gemini:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ chatProf IA ativo na porta ${PORT}`));
