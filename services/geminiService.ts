import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY;

// Define the response schema for structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isVegan: {
      type: Type.BOOLEAN,
      description: "Whether the product is vegan based on ingredients.",
    },
    veganConfidence: {
      type: Type.STRING,
      enum: ["High", "Medium", "Low"],
      description: "Confidence level of the vegan assessment.",
    },
    veganReasoning: {
      type: Type.STRING,
      description: "Explanation for why it is or isn't vegan (e.g., 'Contains milk powder').",
    },
    detectedAllergens: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of common allergens found (e.g., Peanuts, Soy, Gluten, Shellfish).",
    },
    technicalTerms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING, description: "The technical ingredient name (e.g., Tocopherol)." },
          explanation: { type: Type.STRING, description: "Simple explanation of what it is (e.g., Vitamin E)." },
          category: { 
            type: Type.STRING, 
            enum: ['Preservative', 'Colorant', 'Flavor', 'Emulsifier', 'Other'],
            description: "Category of the additive."
          },
        },
        required: ["term", "explanation", "category"],
      },
      description: "List of complex technical ingredients explained simply.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief, friendly summary of the product suitable for a shopper.",
    },
    healthRating: {
      type: Type.NUMBER,
      description: "A score from 1 to 10 indicating general healthiness based on processed level.",
    },
    healthRatingExplanation: {
      type: Type.STRING,
      description: "A specific explanation of factors contributing to the health score (e.g. 'Contains high amounts of saturated fat and sodium', 'Minimally processed with nutrient-dense ingredients').",
    },
  },
  required: ["isVegan", "veganConfidence", "veganReasoning", "detectedAllergens", "technicalTerms", "summary", "healthRating", "healthRatingExplanation"],
};

export const analyzeIngredients = async (
  text: string,
  imageBase64?: string,
  mimeType: string = 'image/jpeg',
  userAllergies: string = ''
): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key not found. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an expert food scientist and nutritionist assistant. 
    Your goal is to analyze ingredient labels provided as text or images.
    
    1. Determine if the product is Vegan.
    2. Identify common allergens (Nuts, Dairy, Soy, Gluten, Eggs, Fish, Shellfish, etc.).
    3. If the user provided specific allergies: "${userAllergies}", check strictly for those as well.
    4. Demystify technical jargon. Find chemical names or E-numbers and explain them in plain English.
    5. Evaluate the healthiness on a scale of 1-10. 10 being natural/unprocessed/healthy, 1 being highly processed/unhealthy. Provide a clear explanation for the score.
    
    Return the response in strict JSON format matching the schema provided.
  `;

  const parts: any[] = [];

  if (imageBase64) {
    parts.push({
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    });
    parts.push({
      text: "Analyze the ingredients list in this image. Ignore branding text if irrelevant to ingredients/dietary info.",
    });
  } else {
    parts.push({
      text: `Analyze this ingredient list: "${text}"`,
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1, // Low temperature for factual accuracy
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No response text received from Gemini.");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze ingredients. Please try again.");
  }
};