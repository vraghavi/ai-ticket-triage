import { Injectable } from "@nestjs/common";
import { AiClient, AiProvider } from "./ai.provider";
import { OpenAiClient } from "./openai.client";
import { GeminiClient } from "./gemini.client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AiService {
    private readonly openaiClient?: AiClient;
    private readonly geminiClient?: AiClient;
    private readonly defaultProvider: AiProvider;

    constructor(
        private prisma: PrismaService
    ) {
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
        provider?: AiProvider,
    ): Promise<{provider: AiProvider; category: string, latency: number}> {
        const chosenProvider = provider ?? this.defaultProvider;
        const client = this.pickClient(chosenProvider);

        const start = Date.now();
        const category = await client.categorizeTicket(text);
        const latency = Date.now() - start;

        const modelName = client.getModelName();

        await this.prisma.aiLog.create({
            data: {
                provider: chosenProvider,
                model: modelName,
                prompt: text,
                response: category,
                category,
                latencyMs: latency
            }
        })

        return {
            provider: chosenProvider,
            category,
            latency,
        };
    }
}