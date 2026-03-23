const OpenAI = require("openai");

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
    this.openai = new OpenAI({ apiKey: this.apiKey });
  }

  async generateChatbotResponse(userMessage, conversationHistory = []) {
    const messages = [
      { role: "system", content: "Tu es un assistant médical professionnel et empathique." },
      ...conversationHistory.map(msg => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages,
      max_tokens: 500,
      temperature: 0.3
    });

    return {
      content: response.choices[0].message.content,
      metadata: {
        model: this.model,
        total_tokens: response.usage.total_tokens
      }
    };
  }

  isAvailable() {
    return !!this.apiKey;
  }
}

module.exports = OpenAIService;