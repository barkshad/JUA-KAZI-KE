import { GoogleGenAI, Type } from "@google/genai";

// Initialize with a helper to prevent crashes if the environment variable isn't set yet
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const optimizeBio = async (currentBio: string, category: string): Promise<string> => {
  try {
    const ai = getAIClient();
    if (!ai) return currentBio;

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
    const ai = getAIClient();
    if (!ai) return [];

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
    console.error("Search keyword generation error:", error);
    return [];
  }
};