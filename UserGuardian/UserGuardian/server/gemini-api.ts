import { Message } from "@shared/schema";

// System messages for different assistance types
const SYSTEM_MESSAGES = {
  GENERAL: "You are UNova, an AI assistant specialized in helping Model United Nations delegates. You provide accurate, concise information about international relations, UN procedures, and diplomatic strategies. You can help with research, speechwriting, debate strategy, and resolution drafting.",
  RESEARCH: "You are UNova's Research Assistant. You provide accurate, up-to-date information on country policies, UN history, international relations, and global issues. Cite sources when possible and focus on factual, unbiased information useful for MUN delegates.",
  SPEECHWRITING: "You are UNova's Speechwriting Assistant. You help delegates craft compelling speeches for Model UN conferences. Structure speeches with formal address, problem definition, national position, policy proposals, and a call to action. Maintain diplomatic tone and formal language appropriate for UN settings.",
  DEBATE: "You are UNova's Debate Strategy Assistant. You help delegates prepare arguments, counterarguments, and rebuttals based on their country's position. Provide tactical advice for moderated and unmoderated caucuses, point out potential allies and opponents, and suggest diplomatic language for challenging situations.",
  RESOLUTION: "You are UNova's Resolution Drafting Assistant. You help delegates create well-structured UN resolutions with appropriate preambulatory and operative clauses. Ensure proper formatting, clear language, and logical flow while maintaining diplomatic terminology consistent with UN documents."
};

export async function generateGeminiResponse(messages: Message[], assistanceType: string = 'GENERAL'): Promise<string> {
  try {
    // Get the appropriate system message based on assistance type
    const systemPrompt = SYSTEM_MESSAGES[assistanceType as keyof typeof SYSTEM_MESSAGES] || SYSTEM_MESSAGES.GENERAL;
    
    // Prepare the conversation history
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));
    
    // Add system message at the beginning if not already there
    if (formattedMessages.length === 0 || formattedMessages[0].role !== 'system') {
      formattedMessages.unshift({
        role: 'system',
        parts: [{ text: systemPrompt }]
      });
    }
    
    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("Gemini API key not found");
    }
    
    // Make request to Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract the generated text from the response
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response structure from Gemini API");
    }
  } catch (error) {
    console.error("Error generating response with Gemini:", error);
    throw error;
  }
}
