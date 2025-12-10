import { Injectable } from "@nestjs/common";
import { AiClient, AiProvider } from "./ai.provider";
import { OpenAiClient } from "./openai.client";
import { GeminiClient } from "./gemini.client";

@Injectable()
export class AiService {
    private readonly openaiClient?: AiClient;
    private readonly geminiClient?: AiClient;
    private readonly defaultProvider: AiProvider;

    constructor() {
        const openAIKey = process.env.OPENAI_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;

        if(openAIKey) {
            this.openaiClient = new OpenAiClient(openAIKey);
        }

        if(geminiKey) {
            this.geminiClient = new GeminiClient(geminiKey);
        }

        this.defaultProvider = process.env.AI_PROVIDER as AiProvider || 'gemini';
    }

    private pickClient(provider?: AiProvider): AiClient {
        const name = provider ?? this.defaultProvider;

        if(name === 'openai') {
            if(!this.openaiClient) {
                throw new Error('OpenAI client not configured (missing OPENAI_API_KEY)');
            }
            return this.openaiClient;
        }

        if(!this.geminiClient) {
            throw new Error('Gemini client not configured (missing GEMINI_API_KEY)');
        }
        return this.geminiClient;
    }

    async categorizeTicket(
        text: string,
        provider: AiProvider,
    ): Promise<{provider: AiProvider; category: string}> {
        const client = this.pickClient(provider);
        const category = await client.categorizeTicket(text);

        return {
            provider: provider ?? this.defaultProvider,
            category,
        }
    }
}