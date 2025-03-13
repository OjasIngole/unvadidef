import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Paperclip, Type, Bold, Italic, Code } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import MessageItem from "./message-item";
import { ASSISTANCE_TYPES } from "@/lib/constants";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { messages, isLoading, sendMessage } = useChat();

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput("");
    setIsTyping(true);
    
    try {
      await sendMessage(message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPromptClick = (prompt: string) => {
    setInput(prompt);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-slate-900">
      {/* Conversation History */}
      <div 
        ref={conversationContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" 
      >
        {/* Messages */}
        {messages.map((message, index) => (
          <MessageItem 
            key={message.id} 
            message={message}
            isFirst={index === 0 && message.role === 'assistant'}
            onQuickPromptClick={handleQuickPromptClick}
          />
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300">
                <span className="material-icons text-sm">smart_toy</span>
              </div>
              <div className="ml-3 bg-white dark:bg-slate-800 rounded-lg px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-150"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                id="chat-input"
                rows={2}
                placeholder="Ask me anything about Model UN..."
                className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none dark:text-white"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                title="Voice input"
                disabled={isLoading}
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-primary-600 hover:bg-primary-700 text-white"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400 px-1">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-1 h-auto hover:text-gray-700 dark:hover:text-gray-300">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 h-auto hover:text-gray-700 dark:hover:text-gray-300">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 h-auto hover:text-gray-700 dark:hover:text-gray-300">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 h-auto hover:text-gray-700 dark:hover:text-gray-300">
                <Code className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <span>Powered by Gemini AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
