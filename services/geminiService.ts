import { GoogleGenAI, Type } from "@google/genai";
import { GameResult, Riddle } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateRiddle = async (): Promise<Riddle | null> => {
  try {
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model,
      contents: "Generate a challenging but solvable logic riddle or brain teaser in Japanese. Ensure the Question, Answer, and Hint are all in natural Japanese.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING },
            hint: { type: Type.STRING },
          },
          required: ["question", "answer", "hint"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as Riddle;
  } catch (error) {
    console.error("Failed to generate riddle:", error);
    return null;
  }
};

export const analyzePerformance = async (history: GameResult[]): Promise<string> => {
  if (history.length === 0) return "まだデータがありません。ゲームをプレイして分析を開始しましょう！";

  try {
    const recentGames = history.slice(-10); // Analyze last 10 games
    const summary = recentGames.map(g => `${g.type}: Score ${g.score} (${g.details})`).join('\n');

    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model,
      contents: `
        You are a professional brain trainer. Analyze these recent game scores and provide specific, encouraging advice to the user in Japanese.
        Keep it concise (under 300 characters).
        
        Data:
        ${summary}
      `,
    });

    return response.text || "分析中にエラーが発生しました。";
  } catch (error) {
    console.error("Failed to analyze performance:", error);
    return "分析サービスに接続できませんでした。";
  }
};