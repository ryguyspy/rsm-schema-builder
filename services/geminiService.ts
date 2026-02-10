
import { GoogleGenAI, Type } from "@google/genai";
import { SchemaType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateSchema = async (type: SchemaType, responses: Record<string, string>) => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Generate a valid JSON-LD schema for a ${type}.
    The user provided the following information:
    ${Object.entries(responses).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
    
    Please return a JSON object containing the "jsonLd" string (ready to be wrapped in a <script type="application/ld+json"> tag) 
    and a short "explanation" of what this schema helps with.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          jsonLd: {
            type: Type.STRING,
            description: "The stringified JSON-LD schema content."
          },
          explanation: {
            type: Type.STRING,
            description: "Brief explanation of the generated schema."
          }
        },
        required: ["jsonLd", "explanation"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
