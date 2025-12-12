import OpenAI from 'openai';
import { AiClient } from './ai.provider';

export class OpenAiClient implements AiClient {
    private client: OpenAI;

    constructor(apiKey: string) {
        this.client = new OpenAI({
            apiKey,
        });
    }

    getModelName(): string {
        return "gpt-4o-mini";
    }

    async categorizeTicket(text: string): Promise<string> {
        const systemPrompt = `
        You are a ticket triage assistant.

        Categorize this ticket into exactly one of:
        ["Payment Issue", "Login Issue", "UI Bug", "Performance", "Other"].

        Only respond with the category text, nothing else.

        Ticket description:
        "${text}"
        `;

        const response = await this.client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text },
            ],
        });
        
        const raw = response.choices[0].message.content?.trim() ?? 'Other';

        const normalized = raw.replace(/category[:\-]?\s*/i, '').trim();

        return normalized || 'Other';
    }
}