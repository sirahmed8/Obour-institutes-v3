import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';

// --- Configuration & Keys ---
// We map the Vite env vars to local constants for cleaner usage
// Cast import.meta to any to resolve TS error 'Property env does not exist on type ImportMeta'
const env = (import.meta as any).env;
const GEMINI_KEY = env.VITE_GEMINI_API_KEY;
const OPENROUTER_KEY = env.VITE_OPENROUTER_API_KEY;

// Initialize Gemini Client
// @google/genai expects the key in the constructor options
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

/**
 * Primary Text Generation Function with Fallback Logic
 * 1. Tries Google Gemini (Primary)
 * 2. If fails, Fallback to OpenRouter (DeepSeek/GPT)
 */
export const generateText = async (prompt: string, model: string = 'gemini-3-flash-preview'): Promise<string> => {
  if (!GEMINI_KEY) return "خطأ: مفتاح Gemini API غير موجود.";

  try {
    // --- Attempt 1: Google Gemini ---
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      }
    });
    
    if (response.text) {
      return response.text;
    }
    throw new Error("Empty response from Gemini");

  } catch (geminiError) {
    console.warn("⚠️ Gemini Failed, switching to OpenRouter fallback...", geminiError);

    // --- Attempt 2: OpenRouter (Gateway to DeepSeek/GPT) ---
    if (!OPENROUTER_KEY) {
      return "عذراً، حدث خطأ في النظام الأساسي ولا يوجد مفتاح بديل.";
    }

    try {
      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://obour-institutes.web.app", // Required by OpenRouter
          "X-Title": "Obour Institutes Platform",
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-chat", // Using DeepSeek via OpenRouter as fallback
          "messages": [
            { "role": "system", "content": SYSTEM_PROMPT },
            { "role": "user", "content": prompt }
          ]
        })
      });

      if (!openRouterResponse.ok) throw new Error("OpenRouter API Failed");

      const data = await openRouterResponse.json();
      return data.choices?.[0]?.message?.content || "لم يتم استلام رد من النظام البديل.";

    } catch (fallbackError) {
      console.error("❌ All AI Services Failed:", fallbackError);
      return "نعتذر، جميع أنظمة الذكاء الاصطناعي مشغولة حالياً. يرجى المحاولة لاحقاً.";
    }
  }
};

export const generateImage = async (prompt: string, isPro: boolean = false): Promise<string | null> => {
  if (!GEMINI_KEY) return null;
  
  const model = isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
         // Specific image generation configs can be added here
      }
    });

    // Extract image from response parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

export const generateVideo = async (prompt: string): Promise<string | null> => {
   console.log("Starting Video Gen for:", prompt);
   
   if (!GEMINI_KEY) {
     console.error("No Gemini Key for Video");
     return null;
   }

   try {
     // Using Veo model for video generation
     let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      // Poll for completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) {
        throw new Error("No video URI returned");
      }

      // Fetch the video content using the API key
      const videoResponse = await fetch(`${downloadLink}&key=${GEMINI_KEY}`);
      if (!videoResponse.ok) throw new Error("Failed to download video");
      
      const blob = await videoResponse.blob();
      return URL.createObjectURL(blob);

   } catch (error) {
     console.error("Video Generation Error:", error);
     // Fallback to mock if quota exceeded or error, to keep UI functional for demo
     return null; 
   }
};