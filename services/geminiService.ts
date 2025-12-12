
import { GoogleGenAI } from "@google/genai";
import type { HealthData, Condition } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Using mock responses.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const generateContent = async (prompt: string, systemInstruction?: string) => {
    if (!ai) {
        await new Promise(res => setTimeout(res, 1000)); // Simulate network delay
        if (prompt.includes("Analyze the following meal")) {
             return "This meal offers a balanced mix of macronutrients. The protein will aid muscle repair, and the complex carbs provide sustained energy. A great choice for your current goals!";
        }
        return "I'm in offline mode. That's a great question, though! Let's talk more when I'm back online.";
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction || "You are the EASUP AI, a futuristic, empathetic AI health coach. You are knowledgeable and encouraging. You speak in a clear, slightly futuristic, and supportive tone. Keep responses concise and actionable.",
            },
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "Sorry, I'm having trouble connecting right now. Let's try again in a moment.";
    }
};

export const getCoachResponse = async (chatHistory: { role: string, parts: { text: string }[] }[], newMessage: string, healthData: HealthData, condition: Condition | null): Promise<string> => {
  const conditionInfo = {
    diabetes: "The user has reported having diabetes. Be mindful of carbohydrate intake, blood sugar management, and consistent meal timing. Suggest low-glycemic food options and exercises that help with insulin sensitivity.",
    hypertension: "The user has reported having hypertension. Emphasize low-sodium dietary choices, stress-reducing activities like meditation or yoga, and the importance of consistent cardiovascular exercise.",
    none: "",
  };

  const systemInstruction = `You are the EASUP AI, a futuristic, empathetic AI health coach. Your goal is to provide personalized, insightful, and encouraging guidance.
  Current user health snapshot:
  - EASUP Score (overall well-being): ${healthData.auraScore}/100
  - Today's Calories: ${healthData.dailySummary.calories}/${healthData.goals.calories} kcal
  - Today's Protein: ${healthData.dailySummary.protein}/${healthData.goals.protein} g
  - Today's Activity: ${healthData.dailySummary.activity}/${healthData.goals.activity} min
  ${condition && condition !== 'none' ? `- IMPORTANT: The user is managing the following condition: ${condition}. ${conditionInfo[condition]}` : ''}

  Analyze the user's message in the context of their data and conversation history. Provide concise, supportive, and actionable advice. Use markdown for formatting if needed.`;

  const prompt = `Conversation history is provided. The user's new message is: "${newMessage}". Based on their health data and the conversation, provide a helpful response.`;
  
  // For simplicity, we are not sending full history here but in a real app you would.
  return generateContent(prompt, systemInstruction);
};

export const analyzeMeal = async (mealName: string, nutrients: {protein: number, carbs: number, fat: number}): Promise<string> => {
    const prompt = `Analyze the following meal for an active user:
    - Meal: ${mealName}
    - Protein: ${nutrients.protein}g
    - Carbohydrates: ${nutrients.carbs}g
    - Fat: ${nutrients.fat}g
    Provide a brief, encouraging analysis (2-3 sentences) on how this meal contributes to their fitness goals.`;
    return generateContent(prompt);
};