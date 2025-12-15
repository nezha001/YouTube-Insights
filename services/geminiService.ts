import { GoogleGenAI } from "@google/genai";
import { ChannelData, SearchResult, VideoStat } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchChannelStats = async (channelName: string): Promise<SearchResult> => {
  const modelId = "gemini-2.5-flash"; // Capable of search and fast response

  const prompt = `
    Find the latest real-time statistics for the YouTube channel: "${channelName}".
    
    I need the following specific details:
    1. Exact Channel Name.
    2. Subscriber Count (e.g., "2.5M", "100K").
    3. Total Channel Views.
    4. Total Video Count.
    5. A short 1-sentence description of what the channel does (Translated to Simplified Chinese).
    6. Find 3 popular or recent videos from this channel and their view counts (Keep titles in original language).

    IMPORTANT: Format your response as a JSON object inside a Markdown code block (\`\`\`json ... \`\`\`).
    The JSON structure must be exactly:
    {
      "channelName": "string",
      "subscribers": "string (formatted)",
      "subscriberCount": number (approximate raw number for sorting),
      "totalViews": "string (formatted)",
      "videoCount": "string (formatted)",
      "description": "string (in Simplified Chinese)",
      "recentVideos": [
        { "title": "video title", "views": number (raw number) }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType cannot be JSON when using search tools, so we parse manually
        temperature: 0.1, // Low temperature for factual extraction
      },
    });

    const text = response.text || "";
    
    // Extract JSON from markdown code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    
    let data: ChannelData | null = null;
    if (jsonMatch && jsonMatch[1]) {
      try {
        // Clean up any potential markdown residue before parsing
        const cleanJson = jsonMatch[1].trim();
        data = JSON.parse(cleanJson) as ChannelData;
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
      }
    } else if (jsonMatch && jsonMatch[0]) {
         // Fallback if the regex captured the braces directly
         try {
            data = JSON.parse(jsonMatch[0]) as ChannelData;
         } catch (e) {
             console.error("Failed to parse JSON (fallback) from Gemini response", e);
         }
    }

    // Extract sources
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk) => {
        return {
          title: chunk.web?.title || "来源",
          uri: chunk.web?.uri || "#",
        };
      })
      .filter((s) => s.uri !== "#") || [];

    return {
      data,
      sources,
      rawText: text,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};