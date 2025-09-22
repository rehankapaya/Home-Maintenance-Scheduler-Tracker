
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Priority, SuggestedTask } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will not be available. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      taskName: {
        type: Type.STRING,
        description: "A concise name for the maintenance task.",
      },
      category: {
        type: Type.STRING,
        description: `The category of the task. Must be one of: ${Object.values(Category).join(", ")}.`,
        enum: Object.values(Category),
      },
      priority: {
        type: Type.STRING,
        description: `The suggested priority. Must be one of: ${Object.values(Priority).join(", ")}.`,
        enum: Object.values(Priority),
      },
      recommendedFrequency: {
        type: Type.STRING,
        description: "How often this task should be performed (e.g., 'Monthly', 'Quarterly', 'Annually').",
      },
    },
    required: ["taskName", "category", "priority", "recommendedFrequency"],
  },
};

export const generateMaintenanceTasks = async (homeDescription: string): Promise<SuggestedTask[]> => {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }
  
  const prompt = `
    Based on the following home description, generate a list of 10-15 essential home maintenance tasks. 
    For each task, provide a name, a category, a priority level, and a recommended frequency.
    The response must be a valid JSON array matching the provided schema.
    Do not include tasks that are not typical for a homeowner to perform themselves or schedule.
    
    Home Description: "${homeDescription}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const suggestions: SuggestedTask[] = JSON.parse(jsonText);
    
    // Data validation
    return suggestions.filter(task => 
      task.taskName && 
      task.category && Object.values(Category).includes(task.category) &&
      task.priority && Object.values(Priority).includes(task.priority) &&
      task.recommendedFrequency
    );

  } catch (error) {
    console.error("Error generating tasks with Gemini:", error);
    throw new Error("Failed to get suggestions from AI service.");
  }
};
