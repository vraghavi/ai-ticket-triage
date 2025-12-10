import { GoogleGenAI } from '@google/genai';
import { AiClient } from './ai.provider';

export class GeminiClient implements AiClient {
  private genAI: GoogleGenAI;

  constructor(apiKey: string) {
    this.genAI = apiKey ? new GoogleGenAI({apiKey}) : new GoogleGenAI({});
  }

  async categorizeTicket(text: string): Promise<string> {
    // const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are a ticket triage assistant.

      Categorize this ticket into exactly one of:
      ["Payment Issue", "Login Issue", "UI Bug", "Performance", "Other"].

      Only respond with the category text, nothing else.

      Ticket description:
      "${text}"
    `;

    const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    const raw = (response.text ?? '').trim();

    const normalized = raw.replace(/category[:\-]?\s*/i, '').trim();

    return normalized || 'Other';
  }
}
