
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const optimizeBio = async (currentBio: string, category: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional marketing copywriter for local Kenyan businesses. 
      Optimize this service provider's bio to be more appealing to customers while remaining professional and concise. 
      Keep it friendly and use Kenyan English context if appropriate.
      
      Category: ${category}
      Current Bio: ${currentBio}`,
      config: {
        maxOutputTokens: 150,
      }
    });

    return response.text || currentBio;
  } catch (error) {
    console.error("Gemini optimization error:", error);
    return currentBio;
  }
};

export const generateSearchKeywords = async (query: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a list of 5 relevant search terms or categories related to the query: "${query}". Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [];
  }
};
