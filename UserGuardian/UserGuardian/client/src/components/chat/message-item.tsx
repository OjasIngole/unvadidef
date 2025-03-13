import { Message } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { QUICK_PROMPTS } from "@/lib/constants";

interface MessageItemProps {
  message: Message;
  onQuickPromptClick?: (prompt: string) => void;
  isFirst?: boolean;
}

export default function MessageItem({ message, onQuickPromptClick, isFirst = false }: MessageItemProps) {
  if (message.role === 'system') {
    return null;
  }

  const isUser = message.role === 'user';
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className={cn(
        "flex items-start",
        isUser && "justify-end"
      )}>
        {/* Avatar */}
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300">
            <span className="material-icons text-sm">smart_toy</span>
          </div>
        )}
        
        {/* Message Bubble */}
        <div className={cn(
          "rounded-lg px-4 py-3 shadow-sm max-w-3xl",
          isUser ? "mr-3 bg-primary-600 text-white" : "ml-3 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200"
        )}>
          {/* If content has bullet points, render as a list */}
          {message.content.includes('• ') || message.content.includes('- ') ? (
            <div>
              {message.content.split('\n').map((line, i) => (
                line.trim().startsWith('• ') || line.trim().startsWith('- ') ? (
                  <div key={i} className="flex">
                    <span className="mr-2">•</span>
                    <span>{line.replace(/^[•-]\s/, '')}</span>
                  </div>
                ) : (
                  <p key={i}>{line}</p>
                )
              ))}
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
          
          {/* Quick Reply Buttons (only on first bot message) */}
          {!isUser && isFirst && onQuickPromptClick && (
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full text-gray-700 dark:text-gray-300 transition"
                  onClick={() => onQuickPromptClick(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {/* User Avatar */}
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
            <span className="material-icons text-sm">person</span>
          </div>
        )}
      </div>
    </div>
  );
}
