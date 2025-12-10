import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Campaign, StrategyPlan } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is valid (simple check)
export const isApiKeyAvailable = (): boolean => {
  return !!apiKey && apiKey.length > 0;
};

export const generateDashboardInsight = async (campaigns: Campaign[]): Promise<string> => {
  if (!isApiKeyAvailable()) {
    return "API Key is missing. Please configure your environment to receive AI insights.";
  }

  try {
    const summary = campaigns.map(c => 
      `Brand: ${c.brand}, Campaign: ${c.name} (Platforms: ${c.platforms.join(', ')}) - Status: ${c.status}, ROI: ${c.roi}x, Spend: $${c.spend}, Impressions: ${c.impressions}`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a Global Marketing Director for a holding company managing major brands like Apple, Coca-Cola, and Nike. Analyze the following campaign performance data. Provide a concise executive summary (max 3 sentences) highlighting the top performing global campaign and a strategic recommendation for resource allocation. Focus on high-level ROI and reach. Data:\n${summary}`,
    });

    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at this moment.";
  }
};

export interface CampaignAnalysisResult {
  analysis: string;
  recommendations: string[];
}

export const generateCampaignSpecificInsight = async (campaign: Campaign): Promise<CampaignAnalysisResult> => {
  if (!isApiKeyAvailable()) {
    return { 
      analysis: "API Key is missing. Cannot generate analysis.", 
      recommendations: ["Configure API Key to see recommendations."] 
    };
  }

  try {
    const prompt = `
      Analyze this specific social media campaign for ${campaign.brand}:
      Campaign Name: "${campaign.name}"
      Platforms: ${campaign.platforms.join(', ')}
      Status: ${campaign.status}
      Spend: $${campaign.spend}
      Impressions: ${campaign.impressions}
      ROI: ${campaign.roi}x
      
      1. Provide a strategic assessment (max 50 words) considering the multi-channel approach.
      2. Provide 3 actionable recommendations for a marketer wanting to replicate this success across these channels.
      
      Return as JSON with keys 'analysis' and 'recommendations' (array of strings).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["analysis", "recommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) return { analysis: "Analysis unavailable.", recommendations: [] };
    
    return JSON.parse(text) as CampaignAnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { analysis: "Analysis currently unavailable.", recommendations: [] };
  }
};

export const generateCampaignIdeas = async (topic: string, platform: string): Promise<{ title: string; caption: string; targetAudience: string }[]> => {
  if (!isApiKeyAvailable()) {
    throw new Error("API Key missing");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 3 creative, high-budget social media campaign ideas for the topic "${topic}" specifically for ${platform}. These should be suitable for a Fortune 500 brand. Return JSON data only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              caption: { type: Type.STRING },
              targetAudience: { type: Type.STRING }
            },
            required: ["title", "caption", "targetAudience"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Idea Gen Error:", error);
    return [];
  }
};

export const generateCampaignNextSteps = async (campaign: Campaign): Promise<StrategyPlan | null> => {
  if (!isApiKeyAvailable()) {
    console.error("API Key missing for Strategy Generation");
    return null;
  }

  try {
    const prompt = `
      Act as a Chief Strategy Officer. A major campaign has just been analyzed.
      
      Context:
      Brand: ${campaign.brand}
      Campaign: "${campaign.name}"
      Status: ${campaign.status}
      ROI: ${campaign.roi}x
      Impressions: ${campaign.impressions}
      
      Task: Create a "Strategic Takeaway & Continuation Plan" (Next Steps) to capitalize on this campaign's momentum (or fix it if performance is low).
      
      Requirements:
      1. Create a sophisticated title for this strategic roadmap.
      2. Write a concise executive summary of the takeaway.
      3. Define the Market Context (why these results matter now).
      4. Break the NEXT steps down into 3 distinct phases (e.g., Amplify, Sustain, Cross-Sell).
      5. Recommend channels for the next phase.
      6. Define success metrics (KPIs) for the next phase.

      Return purely JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            marketContext: { type: Type.STRING },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseName: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  keyActions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["phaseName", "duration", "keyActions"]
              }
            },
            recommendedChannels: { type: Type.ARRAY, items: { type: Type.STRING } },
            successMetrics: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "executiveSummary", "marketContext", "phases", "recommendedChannels", "successMetrics"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      console.error("Empty response from Strategy Gen");
      return null;
    }
    return JSON.parse(text) as StrategyPlan;
  } catch (error) {
    console.error("Strategy Gen Error:", error);
    return null;
  }
};

export const generateStrategicPlan = async (brand: string, challenge: string, goal: string, timeline: string): Promise<StrategyPlan | null> => {
  if (!isApiKeyAvailable()) throw new Error("API Key missing");

  try {
    const prompt = `
      Act as a Chief Strategy Officer.
      
      Context:
      Brand: ${brand}
      Current Challenge: ${challenge}
      Primary Goal: ${goal}
      Execution Timeline: ${timeline}
      
      Task: Create a comprehensive strategic roadmap to address the challenge and achieve the goal.
      
      Requirements:
      1. Create a sophisticated title for this strategic roadmap.
      2. Write a concise executive summary.
      3. Define the Market Context.
      4. Break the plan down into 3 distinct phases.
      5. Recommend specific marketing channels.
      6. Define clear success metrics (KPIs).

      Return purely JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            marketContext: { type: Type.STRING },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseName: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  keyActions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["phaseName", "duration", "keyActions"]
              }
            },
            recommendedChannels: { type: Type.ARRAY, items: { type: Type.STRING } },
            successMetrics: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "executiveSummary", "marketContext", "phases", "recommendedChannels", "successMetrics"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as StrategyPlan;
  } catch (error) {
    console.error("Strategic Plan Gen Error:", error);
    return null;
  }
};