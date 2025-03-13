import { users, speeches, resolutions, researchNotes, conversations, type User, type InsertUser, type Speech, type InsertSpeech, type Resolution, type InsertResolution, type ResearchNote, type InsertResearchNote, type Conversation, type InsertConversation, type Message } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { eq, and, desc } from "drizzle-orm";
import connectPgSimple from "connect-pg-simple";

// Create pool for session store
import pg from 'pg';
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const MemoryStore = createMemoryStore(session);
const PostgresStore = connectPgSimple(session);

// Create a neon client for Drizzle ORM
const sql = neon(process.env.DATABASE_URL!);
// Use 'as any' to bypass type checking issue with neon query function
const db = drizzle(sql as any);

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  // Speech methods
  getSpeech(id: number): Promise<Speech | undefined>;
  getUserSpeeches(userId: number): Promise<Speech[]>;
  createSpeech(speech: InsertSpeech): Promise<Speech>;
  updateSpeech(id: number, data: Partial<Speech>): Promise<Speech | undefined>;
  deleteSpeech(id: number): Promise<boolean>;
  
  // Resolution methods
  getResolution(id: number): Promise<Resolution | undefined>;
  getUserResolutions(userId: number): Promise<Resolution[]>;
  createResolution(resolution: InsertResolution): Promise<Resolution>;
  updateResolution(id: number, data: Partial<Resolution>): Promise<Resolution | undefined>;
  deleteResolution(id: number): Promise<boolean>;
  
  // Research notes methods
  getResearchNote(id: number): Promise<ResearchNote | undefined>;
  getUserResearchNotes(userId: number): Promise<ResearchNote[]>;
  createResearchNote(note: InsertResearchNote): Promise<ResearchNote>;
  updateResearchNote(id: number, data: Partial<ResearchNote>): Promise<ResearchNote | undefined>;
  deleteResearchNote(id: number): Promise<boolean>;
  
  // Conversation methods
  getConversation(id: number): Promise<Conversation | undefined>;
  getUserConversations(userId: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, data: Partial<Conversation>): Promise<Conversation | undefined>;
  deleteConversation(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.Store;
}

export class PostgresStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresStore({
      pool,
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return results[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return results[0];
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.googleId, googleId)).limit(1);
    return results[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const userData = {
      ...insertUser,
      createdAt: now,
      // Ensure nullable fields are explicitly null if undefined
      name: insertUser.name ?? null,
      googleId: insertUser.googleId ?? null
    };
    
    const results = await db.insert(users).values(userData).returning();
    return results[0];
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const results = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    
    return results[0];
  }
  
  // Speech methods
  async getSpeech(id: number): Promise<Speech | undefined> {
    const results = await db.select().from(speeches).where(eq(speeches.id, id)).limit(1);
    return results[0];
  }
  
  async getUserSpeeches(userId: number): Promise<Speech[]> {
    return db.select()
      .from(speeches)
      .where(eq(speeches.userId, userId))
      .orderBy(desc(speeches.createdAt));
  }
  
  async createSpeech(insertSpeech: InsertSpeech): Promise<Speech> {
    const now = new Date();
    const speechData = {
      ...insertSpeech,
      createdAt: now,
      updatedAt: now,
      // Ensure nullable fields are explicitly null if undefined
      type: insertSpeech.type ?? null,
      committee: insertSpeech.committee ?? null
    };
    
    const results = await db.insert(speeches).values(speechData).returning();
    return results[0];
  }
  
  async updateSpeech(id: number, data: Partial<Speech>): Promise<Speech | undefined> {
    const updatedData = {
      ...data,
      updatedAt: new Date()
    };
    
    const results = await db
      .update(speeches)
      .set(updatedData)
      .where(eq(speeches.id, id))
      .returning();
    
    return results[0];
  }
  
  async deleteSpeech(id: number): Promise<boolean> {
    const result = await db
      .delete(speeches)
      .where(eq(speeches.id, id));
    
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Resolution methods
  async getResolution(id: number): Promise<Resolution | undefined> {
    const results = await db.select().from(resolutions).where(eq(resolutions.id, id)).limit(1);
    return results[0];
  }
  
  async getUserResolutions(userId: number): Promise<Resolution[]> {
    return db.select()
      .from(resolutions)
      .where(eq(resolutions.userId, userId))
      .orderBy(desc(resolutions.createdAt));
  }
  
  async createResolution(insertResolution: InsertResolution): Promise<Resolution> {
    const now = new Date();
    const resolutionData = {
      ...insertResolution,
      createdAt: now,
      updatedAt: now,
      // Ensure nullable fields are explicitly null if undefined
      committee: insertResolution.committee ?? null
    };
    
    const results = await db.insert(resolutions).values(resolutionData).returning();
    return results[0];
  }
  
  async updateResolution(id: number, data: Partial<Resolution>): Promise<Resolution | undefined> {
    const updatedData = {
      ...data,
      updatedAt: new Date()
    };
    
    const results = await db
      .update(resolutions)
      .set(updatedData)
      .where(eq(resolutions.id, id))
      .returning();
    
    return results[0];
  }
  
  async deleteResolution(id: number): Promise<boolean> {
    const result = await db
      .delete(resolutions)
      .where(eq(resolutions.id, id));
    
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Research notes methods
  async getResearchNote(id: number): Promise<ResearchNote | undefined> {
    const results = await db.select().from(researchNotes).where(eq(researchNotes.id, id)).limit(1);
    return results[0];
  }
  
  async getUserResearchNotes(userId: number): Promise<ResearchNote[]> {
    return db.select()
      .from(researchNotes)
      .where(eq(researchNotes.userId, userId))
      .orderBy(desc(researchNotes.createdAt));
  }
  
  async createResearchNote(insertNote: InsertResearchNote): Promise<ResearchNote> {
    const now = new Date();
    const noteData = {
      ...insertNote,
      createdAt: now,
      updatedAt: now,
      // Ensure nullable fields are explicitly null if undefined
      country: insertNote.country ?? null,
      topic: insertNote.topic ?? null,
      tags: insertNote.tags ?? null
    };
    
    const results = await db.insert(researchNotes).values(noteData).returning();
    return results[0];
  }
  
  async updateResearchNote(id: number, data: Partial<ResearchNote>): Promise<ResearchNote | undefined> {
    const updatedData = {
      ...data,
      updatedAt: new Date()
    };
    
    const results = await db
      .update(researchNotes)
      .set(updatedData)
      .where(eq(researchNotes.id, id))
      .returning();
    
    return results[0];
  }
  
  async deleteResearchNote(id: number): Promise<boolean> {
    const result = await db
      .delete(researchNotes)
      .where(eq(researchNotes.id, id));
    
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Conversation methods
  async getConversation(id: number): Promise<Conversation | undefined> {
    const results = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
    return results[0];
  }
  
  async getUserConversations(userId: number): Promise<Conversation[]> {
    return db.select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.createdAt));
  }
  
  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const now = new Date();
    
    // Use SQL directly to avoid Drizzle TypeScript issues
    const query = `
      INSERT INTO conversations (user_id, title, messages, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, user_id, title, messages, created_at, updated_at
    `;
    
    const values = [
      insertConversation.userId,
      insertConversation.title,
      JSON.stringify(insertConversation.messages),
      now,
      now
    ];
    
    const { rows } = await pool.query(query, values);
    
    // Return in the expected format
    return {
      id: rows[0].id,
      userId: rows[0].user_id,
      title: rows[0].title,
      messages: rows[0].messages,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at
    };
  }
  
  async updateConversation(id: number, data: Partial<Conversation>): Promise<Conversation | undefined> {
    const now = new Date();
    
    // Handle messages separately since they need to be JSON stringified
    let query = 'UPDATE conversations SET updated_at = $1';
    const values: any[] = [now];
    let paramCount = 2;
    
    if (data.title) {
      query += `, title = $${paramCount}`;
      values.push(data.title);
      paramCount++;
    }
    
    if (data.messages) {
      query += `, messages = $${paramCount}`;
      values.push(JSON.stringify(data.messages));
      paramCount++;
    }
    
    query += ' WHERE id = $' + paramCount + ' RETURNING id, user_id, title, messages, created_at, updated_at';
    values.push(id);
    
    const { rows } = await pool.query(query, values);
    
    if (rows.length === 0) {
      return undefined;
    }
    
    // Return in the expected format
    return {
      id: rows[0].id,
      userId: rows[0].user_id,
      title: rows[0].title,
      messages: rows[0].messages,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at
    };
  }
  
  async deleteConversation(id: number): Promise<boolean> {
    const result = await db
      .delete(conversations)
      .where(eq(conversations.id, id));
    
    return result.rowCount !== null && result.rowCount > 0;
  }
}

// Export PostgresStorage as the default storage
export const storage = new PostgresStorage();
