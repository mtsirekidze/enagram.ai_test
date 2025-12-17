import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateGeorgianTestCases = async (difficulty: 'simple' | 'complex'): Promise<string[]> => {
  const modelId = 'gemini-2.5-flash';
  
  const prompt = `
    Generate 5 distinct Georgian sentences that contain common spelling or grammatical errors specifically to test a spellchecker (Enagram).
    The difficulty level is: ${difficulty}.
    
    For each sentence, include a word with an intentional typo or a grammatical mistake common for Georgian speakers.
    Do not include the translation or explanation, just the raw Georgian text with errors.
    Return the result as a JSON array of strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Error generating test cases:", error);
    return [
      "ვერ მოხერხდა ტესტების გენერირება.",
      "სცადეთ თავიდან."
    ];
  }
};