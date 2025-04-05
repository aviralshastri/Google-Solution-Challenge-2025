// app/api/ai/fitmate/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    // Initialize the API
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
    
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };
    
    // Format history correctly
    const chatHistory = [];
    
    // If there's no user message yet, don't try to build history
    if (messages.filter(msg => msg.role === "user").length > 0) {
      for (let i = 0; i < messages.length - 1; i++) {
        // Skip the initial assistant greeting if it's the first message
        if (i === 0 && messages[i].role === "assistant") continue;
        
        chatHistory.push({
          role: messages[i].role === "user" ? "user" : "model",
          parts: [{ text: messages[i].content }]
        });
      }
    }
    
    // Create the chat session without system instruction
    const chatSession = model.startChat({
      generationConfig,
      history: chatHistory,
    });
    
    // Get the latest user message
    const userMessage = messages[messages.length - 1].content;
    
    // Add the system instruction as a prefix to the user message
    const systemInstruction = "You are FitMate, a fitness and sports assistant designed to help athletes. Only respond to questions related to fitness, sports, training, nutrition for athletes, recovery, and general athletic performance. If asked about topics unrelated to athletics or sports, politely redirect the conversation back to fitness-related topics. Now answer the following question: ";
    
    // Send the message with the prepended instruction
    const result = await chatSession.sendMessage(systemInstruction + userMessage);
    const response = result.response.text();
    
    return new Response(JSON.stringify({ response }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return new Response(JSON.stringify({ 
      error: "Failed to process request", 
      details: error.message 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}