import { GoogleGenAI, Type } from "@google/genai";
import { Category, Priority, SuggestedTask, Task, PersonalizedRecommendation } from "../types";

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
      recommendedProfessional: {
        type: Type.STRING,
        description: "If a professional is recommended for this task (e.g., 'Plumber', 'Electrician'), specify the trade. Otherwise, leave empty or null.",
      },
    },
    required: ["taskName", "category", "priority", "recommendedFrequency"],
  },
};

const recommendationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      taskName: { type: Type.STRING, description: "A concise name for the maintenance task." },
      category: { type: Type.STRING, description: `The category of the task. Must be one of: ${Object.values(Category).join(", ")}.`, enum: Object.values(Category) },
      priority: { type: Type.STRING, description: `The suggested priority. Must be one of: ${Object.values(Priority).join(", ")}.`, enum: Object.values(Priority) },
      recommendedFrequency: { type: Type.STRING, description: "How often this task should be performed (e.g., 'Monthly', 'Quarterly', 'Annually')." },
      recommendedProfessional: { type: Type.STRING, description: "If a professional is recommended (e.g., 'Plumber'), specify the trade. Otherwise, leave empty or null." },
      reason: {
        type: Type.STRING,
        description: "A short, friendly explanation for why this task is being recommended now (e.g., 'It has been over a year since your last gutter cleaning.')."
      }
    },
    required: ["taskName", "category", "priority", "recommendedFrequency", "reason"],
  },
};

export const generateMaintenanceTasks = async (homeDescription: string): Promise<SuggestedTask[]> => {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }
  
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const prompt = `
    Based on the following home description, generate a list of 10-15 essential home maintenance tasks. 
    It is currently ${currentMonth}, so please prioritize tasks that are relevant for this time of year (e.g., winter preparations, spring cleaning, summer AC servicing).
    Analyze the description for clues about its location and climate (e.g., coastal, snowy region, hot climate) to provide even more specific suggestions.
    For each task, provide a name, a category, a priority level, a recommended frequency, and if a professional is typically required, suggest the type of professional (e.g., "Plumber", "Electrician").
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


export const generatePersonalizedRecommendations = async (homeDescription: string, tasks: Task[]): Promise<PersonalizedRecommendation[]> => {
  if (!API_KEY) {
    // Return empty array or a mock response if API key is not set
    return [];
    // Or throw new Error("API key is not configured.");
  }

  const simplifiedTasks = tasks
    .filter(t => t.completed && t.completedDate)
    .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime())
    .slice(0, 20) // Limit to recent history to keep prompt size manageable
    .map(t => ({
      name: t.name,
      category: t.category,
      completedDate: t.completedDate,
      recurrence: t.recurrence,
    }));

  const prompt = `
    You are a helpful and proactive home maintenance assistant.
    Based on the user's home description and their recent task history, provide 2-4 personalized and timely maintenance recommendations.

    **Current Date:** ${new Date().toDateString()}

    **Home Description:** "${homeDescription}"

    **Recent Completed Task History:**
    ${simplifiedTasks.length > 0 ? JSON.stringify(simplifiedTasks, null, 2) : "No completed tasks yet."}

    **Your Goal:**
    1.  **Analyze Location & Season:** Scrutinize the home description for clues about its location, climate (e.g., coastal, snowy region, hot climate), and features (e.g., wooden deck, yard). Use this, along with the current date, to suggest highly relevant seasonal and regional tasks. For instance, recommend 'Prepare for hurricane season' for a coastal home in late spring, or 'Check furnace filters' for a home in a cold region before winter.
    2.  **Check Task History:** Analyze the task history to find recurring tasks that may be due again. For example, if 'Service HVAC' was completed over a year ago and is 'Yearly', it's due.
    3.  **Find Gaps:** Suggest important new tasks based on the home description that appear to be missing from their history (e.g., suggest 'Gutter Cleaning' for a house with a yard in the fall).
    4.  **Create a Great Reason:** For each recommendation, provide a short, friendly, and specific **reason** why you are suggesting it now. The reason should be encouraging and informative.

    Provide the output as a valid JSON array matching the provided schema. Only return recommendations you are confident about. If you have no good recommendations, return an empty array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recommendationSchema,
      },
    });

    const jsonText = response.text.trim();
    const recommendations: PersonalizedRecommendation[] = JSON.parse(jsonText);
    
     // Data validation
    return recommendations.filter(rec => 
      rec.taskName && 
      rec.category && Object.values(Category).includes(rec.category) &&
      rec.priority && Object.values(Priority).includes(rec.priority) &&
      rec.reason
    );

  } catch (error) {
    console.error("Error generating personalized recommendations with Gemini:", error);
    // In case of an error, return an empty array to avoid breaking the UI
    return [];
  }
};