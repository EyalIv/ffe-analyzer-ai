import { GoogleGenAI, Type } from "@google/genai";
import { FFEAnalysis } from "../types";

// Initialize the client. API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    itemCount: {
      type: Type.INTEGER,
      description: "The total number of FF&E items identified in the image.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief summary of the interior design style and the collection of objects found.",
    },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: {
            type: Type.STRING,
            description: "The name of the object (e.g., 'Double Bed', 'Table Lamp', 'Persian Rug').",
          },
          description: {
            type: Type.STRING,
            description: "A short visual description of the object (e.g., 'Grey upholstered headboard', 'Brass finish with white shade').",
          },
          box_2d: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER },
            description: "Bounding box coordinates in the order [ymin, xmin, ymax, xmax]. Values should be normalized (0 to 1).",
          },
        },
        required: ["label", "description", "box_2d"],
      },
      description: "A list of all Furniture, Fixtures, and Equipment identified.",
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "A confidence score between 0 and 1 regarding the identification.",
    }
  },
  required: ["itemCount", "summary", "items", "confidenceScore"],
};

export const analyzeImageForFFE = async (base64Image: string, mimeType: string): Promise<FFEAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Identify all Furniture, Fixtures, and Equipment (FF&E) in this image. List every single item found separately. For each item, provide a specific label and a short visual description (material, color, style). Return the bounding box (2d box) for every item.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4,
        systemInstruction: "You are an expert Interior Designer and FF&E Specialist. Your task is to identify movable objects in a room, list them with detailed descriptions, and provide accurate 2D bounding boxes for visual identification.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    try {
      // Clean up markdown code blocks if present (just in case)
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanedText) as FFEAnalysis;
      
      if (!data.items) {
        data.items = [];
      }
      
      // Post-processing to handle duplicate labels (e.g., "Chair 1", "Chair 2")
      const labelCounts: Record<string, number> = {};
      data.items.forEach(item => {
        labelCounts[item.label] = (labelCounts[item.label] || 0) + 1;
      });

      const currentCounts: Record<string, number> = {};
      data.items = data.items.map((item, index) => {
        let finalLabel = item.label;
        
        // If there are multiple items with the same label, append a counter
        if (labelCounts[item.label] > 1) {
          currentCounts[item.label] = (currentCounts[item.label] || 0) + 1;
          finalLabel = `${item.label} ${currentCounts[item.label]}`;
        }
        
        return {
          ...item,
          label: finalLabel,
          id: `item-${index}`
        };
      });
      
      return data;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw Text:", text);
      throw new Error("Failed to parse analysis results. The model output was not valid JSON.");
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Propagate the specific error message
    throw new Error(error.message || "Unknown error occurred during analysis.");
  }
};