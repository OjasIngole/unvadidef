import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { generateGeminiResponse } from "./gemini-api";
import { Message } from "@shared/schema";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API routes
  // Chat endpoints
  app.post("/api/chat", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const { message, assistanceType, conversationId } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const userId = req.user.id;
      
      // Add user message to conversation
      const userMessage: Message = {
        id: nanoid(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      let conversation;
      
      // If conversationId provided, update existing conversation
      if (conversationId) {
        conversation = await storage.getConversation(Number(conversationId));
        
        if (!conversation || conversation.userId !== userId) {
          return res.status(404).json({ message: "Conversation not found" });
        }
        
        const updatedMessages = [...conversation.messages, userMessage];
        
        // Generate AI response
        const aiResponseText = await generateGeminiResponse(updatedMessages, assistanceType);
        
        // Create assistant message
        const assistantMessage: Message = {
          id: nanoid(),
          role: 'assistant',
          content: aiResponseText,
          timestamp: new Date().toISOString()
        };
        
        // Update conversation with both messages
        const finalMessages = [...updatedMessages, assistantMessage];
        conversation = await storage.updateConversation(conversation.id, {
          messages: finalMessages,
          updatedAt: new Date()
        });
      } else {
        // Create new conversation
        const systemMessage: Message = {
          id: nanoid(),
          role: 'system',
          content: "You are UNova, a helpful assistant for Model UN delegates.",
          timestamp: new Date().toISOString()
        };
        
        const messages = [systemMessage, userMessage];
        
        // Generate AI response
        const aiResponseText = await generateGeminiResponse(messages, assistanceType);
        
        // Create assistant message
        const assistantMessage: Message = {
          id: nanoid(),
          role: 'assistant',
          content: aiResponseText,
          timestamp: new Date().toISOString()
        };
        
        // Create new conversation with all messages
        conversation = await storage.createConversation({
          userId,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
          messages: [...messages, assistantMessage]
        });
      }
      
      // Make sure conversation exists before accessing properties
      if (!conversation) {
        return res.status(500).json({ message: "Failed to create conversation" });
      }
      
      res.json({
        conversationId: conversation.id,
        messages: conversation.messages
      });
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ message: "Failed to process chat request" });
    }
  });

  // Get user conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const userId = req.user.id;
      const conversations = await storage.getUserConversations(userId);
      
      // Return simplified conversations for the list view
      const simplifiedConversations = conversations.map(conv => ({
        id: conv.id,
        title: conv.title,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        preview: conv.messages[conv.messages.length - 2]?.content.slice(0, 100) || ""
      }));
      
      res.json(simplifiedConversations);
    } catch (error) {
      console.error("Get conversations error:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Get specific conversation
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const conversationId = Number(req.params.id);
      const userId = req.user.id;
      
      const conversation = await storage.getConversation(conversationId);
      
      if (!conversation || conversation.userId !== userId) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      console.error("Get conversation error:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const conversationId = Number(req.params.id);
      const userId = req.user.id;
      
      const conversation = await storage.getConversation(conversationId);
      
      if (!conversation || conversation.userId !== userId) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      await storage.deleteConversation(conversationId);
      res.status(200).json({ message: "Conversation deleted successfully" });
    } catch (error) {
      console.error("Delete conversation error:", error);
      res.status(500).json({ message: "Failed to delete conversation" });
    }
  });

  // Speech endpoints
  app.get("/api/speeches", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const userId = req.user.id;
      const speeches = await storage.getUserSpeeches(userId);
      
      res.json(speeches);
    } catch (error) {
      console.error("Get speeches error:", error);
      res.status(500).json({ message: "Failed to fetch speeches" });
    }
  });
  
  app.post("/api/speeches", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const userId = req.user.id;
      const { title, content, committee, type } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }
      
      const speech = await storage.createSpeech({
        userId,
        title,
        content,
        committee,
        type
      });
      
      res.status(201).json(speech);
    } catch (error) {
      console.error("Create speech error:", error);
      res.status(500).json({ message: "Failed to create speech" });
    }
  });

  // Resolution endpoints
  app.get("/api/resolutions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const userId = req.user.id;
      const resolutions = await storage.getUserResolutions(userId);
      
      res.json(resolutions);
    } catch (error) {
      console.error("Get resolutions error:", error);
      res.status(500).json({ message: "Failed to fetch resolutions" });
    }
  });
  
  app.post("/api/resolutions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const userId = req.user.id;
      const { title, content, committee } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }
      
      const resolution = await storage.createResolution({
        userId,
        title,
        content,
        committee
      });
      
      res.status(201).json(resolution);
    } catch (error) {
      console.error("Create resolution error:", error);
      res.status(500).json({ message: "Failed to create resolution" });
    }
  });

  // Research notes endpoints
  app.get("/api/research-notes", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const userId = req.user.id;
      const notes = await storage.getUserResearchNotes(userId);
      
      res.json(notes);
    } catch (error) {
      console.error("Get research notes error:", error);
      res.status(500).json({ message: "Failed to fetch research notes" });
    }
  });
  
  app.post("/api/research-notes", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const userId = req.user.id;
      const { title, content, country, topic, tags } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }
      
      const note = await storage.createResearchNote({
        userId,
        title,
        content,
        country,
        topic,
        tags: tags || []
      });
      
      res.status(201).json(note);
    } catch (error) {
      console.error("Create research note error:", error);
      res.status(500).json({ message: "Failed to create research note" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
