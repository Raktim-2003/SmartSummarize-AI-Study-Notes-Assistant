
import { GoogleGenAI } from "@google/genai";
import { SummaryStyle } from "./types";

const MODEL_NAME = "gemini-3-flash-preview";

export const generateSummary = async (text: string, style: SummaryStyle): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const stylePrompts: Record<SummaryStyle, string> = {
    concise: "Provide a high-level, short, and concise summary focusing only on the most critical points.",
    detailed: "Provide a comprehensive and detailed summary that covers all major sub-topics and nuances.",
    bullets: "Provide a structured summary using only bullet points. Organize them logically.",
    teacher: "Explain this like a helpful teacher would to a student. Use analogies, simplify complex terms, and be encouraging."
  };

  const systemInstruction = `You are a world-class academic assistant specialized in creating study notes. 
  Your goal is to help students understand complex topics quickly. 
  Output your response in clean Markdown format. 
  ${stylePrompts[style]}`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: text,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate summary. Please check your internet connection and try again.");
  }
};
