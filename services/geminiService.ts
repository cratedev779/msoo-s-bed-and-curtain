
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string; } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("Failed to read file as base64 string"));
      }
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const generateDescriptionWithGemini = async (productName: string, imageFile: File): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("Elegant and high-quality product for your home. (API key not configured)";
  }

  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = {
      text: `Generate a compelling and neat e-commerce product description for a product named "${productName}". The target audience appreciates luxury, comfort, and style for their home. Focus on the material, feel, and how it enhances a room's ambiance. Keep the description between 100 and 150 words. Be evocative and appealing.`
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return "Failed to generate description. Please write one manually.";
  }
};
