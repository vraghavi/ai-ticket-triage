export type AiProvider = 'openai' | 'anthropic' | 'gemini';

export interface AiClient {
    categorizeTicket(text: string): Promise<string>;
}