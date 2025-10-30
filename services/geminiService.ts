
import { GoogleGenAI, Chat } from '@google/genai';
import { Message } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzePlantImage = async (imageFile: File): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `
      You are an expert botanist and gardening assistant named Garden Guru.
      A user has uploaded an image of a plant. Your task is to:
      1.  Identify the plant in the image with its common and scientific name. If you cannot identify it, say so politely.
      2.  Provide detailed and easy-to-understand care instructions. Organize the instructions into the following sections:
          - **Watering:** How often and how much to water.
          - **Sunlight:** The ideal amount and type of light (direct, indirect).
          - **Soil:** The best type of soil mix.
          - **Fertilizing:** When and with what to fertilize.
          - **Common Pests & Diseases:** List common issues and how to treat them.
      Format your response in clean Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error analyzing plant image:", error);
    return "Sorry, I encountered an error while analyzing the image. Please try again.";
  }
};


const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: `You are Garden Guru, a friendly and knowledgeable gardening assistant. 
    Users will ask you questions about gardening, plants, and the analysis you've previously provided.
    Be helpful, encouraging, and provide clear, actionable advice. Format your responses in clean markdown.`,
  },
});


export const sendMessageToBot = async (history: Message[], newMessage: string): Promise<string> => {
    try {
        // Since the Gemini chat instance maintains its own history, we only need to send the latest message.
        // For a stateless approach, you would pass the full history each time.
        // With `ai.chats.create`, the session is stateful.
        const result = await chat.sendMessage({ message: newMessage });
        return result.text;
    } catch (error) {
        console.error("Error sending message to bot:", error);
        return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }
};
