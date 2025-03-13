import { createContext, ReactNode, useContext, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { Message } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ASSISTANCE_TYPES } from "@/lib/constants";

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  conversationId: number | null;
  sendMessage: (content: string, assistanceType?: string) => Promise<void>;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);

  // Get initial greeting message
  useQuery<{ messages: Message[] }, Error>({
    queryKey: ['/api/initial-greeting'],
    queryFn: () => {
      // Create initial greeting without API call
      const initialGreeting: Message = {
        id: nanoid(),
        role: 'assistant',
        content: "Hello! I'm DiplomatAI, your personal Model UN assistant. How can I help you today?",
        timestamp: new Date().toISOString()
      };
      
      setMessages([initialGreeting]);
      return { messages: [initialGreeting] };
    },
    enabled: messages.length === 0,
    staleTime: Infinity,
  });

  const chatMutation = useMutation({
    mutationFn: async ({ message, assistanceType }: { message: string, assistanceType?: string }) => {
      const res = await apiRequest("POST", "/api/chat", {
        message,
        conversationId,
        assistanceType: assistanceType || ASSISTANCE_TYPES.GENERAL
      });
      return await res.json();
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Send message function
  const sendMessage = async (content: string, assistanceType?: string) => {
    try {
      // Add user message to UI immediately
      const userMessage: Message = {
        id: nanoid(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, userMessage]);
      
      // Add typing indicator (handled by component)
      
      // Send to API
      const result = await chatMutation.mutateAsync({ 
        message: content,
        assistanceType
      });
      
      // Update with API response
      setMessages(result.messages);
      setConversationId(result.conversationId);
      
      // Invalidate conversations cache if needed
      if (!conversationId) {
        queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Reset chat
  const resetChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading: chatMutation.isPending,
        conversationId,
        sendMessage,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
