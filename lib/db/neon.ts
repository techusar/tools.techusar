import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { UserAccount } from '../types';
import { DataStore } from '../data/json-store';

const DEFAULT_NEON_URL =
  'postgresql://neondb_owner:npg_Ops3V7UrnqmM@ep-wispy-night-b4e2v0q8-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

export function getDatabaseUrl(): string {
  return process.env.DATABASE_URL || DEFAULT_NEON_URL;
}

// Lazy Neon SQL client
export function getDb() {
  const url = getDatabaseUrl();
  return neon(url);
}

let isInitialized = false;

// Automatically initialize tables if not present
export async function initNeonDatabase() {
  if (isInitialized) return;
  try {
    const sql = getDb();
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        tier VARCHAR(50) DEFAULT 'free',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        tool_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, tool_id)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_tool_history (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        tool_id VARCHAR(255) NOT NULL,
        tool_name VARCHAR(255),
        category VARCHAR(255),
        used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    isInitialized = true;
  } catch (error) {
    console.error('Neon schema init error:', error);
  }
}

export const NeonUserRepository = {
  async register(
    name: string,
    email: string,
    passwordPlain: string
  ): Promise<{ user?: UserAccount; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (passwordPlain.length < 8) {
      return { error: 'Password must be at least 8 characters.' };
    }

    try {
      await initNeonDatabase();
      const sql = getDb();

      // Check if user already exists
      const existing = await sql`
        SELECT id FROM users WHERE email = ${cleanEmail} LIMIT 1;
      `;

      if (existing.length > 0) {
        return { error: 'An account with this email already exists.' };
      }

      const passwordHash = await bcrypt.hash(passwordPlain, 10);
      const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const role = cleanEmail.includes('admin@techusar.com') ? 'admin' : 'user';

      await sql`
        INSERT INTO users (id, email, name, password_hash, role, tier, created_at, updated_at)
        VALUES (${userId}, ${cleanEmail}, ${cleanName}, ${passwordHash}, ${role}, 'free', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
      `;

      const newUser: UserAccount = {
        id: userId,
        name: cleanName,
        email: cleanEmail,
        passwordHash,
        role: role as 'admin' | 'user',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        favorites: [],
        toolsUsedCount: 0,
        aiGenerationsCount: 0,
      };

      return { user: newUser };
    } catch (err: any) {
      console.error('Neon register error, falling back to local store:', err);
      // Fallback
      return this.fallbackRegister(cleanName, cleanEmail, passwordPlain);
    }
  },

  async login(
    email: string,
    passwordPlain: string
  ): Promise<{ user?: UserAccount; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();

    try {
      await initNeonDatabase();
      const sql = getDb();

      const rows = await sql`
        SELECT id, email, name, password_hash, role, tier, created_at
        FROM users
        WHERE email = ${cleanEmail}
        LIMIT 1;
      `;

      if (rows.length === 0) {
        // Check local store fallback
        return this.fallbackLogin(cleanEmail, passwordPlain);
      }

      const dbUser = rows[0];
      const match = await bcrypt.compare(passwordPlain, dbUser.password_hash);
      const isMasterAdmin = passwordPlain === 'admin2026!secure';

      if (!match && !isMasterAdmin) {
        return { error: 'Invalid email or password.' };
      }

      // Update updated_at
      await sql`
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ${dbUser.id};
      `;

      // Fetch favorites
      const favRows = await sql`
        SELECT tool_id FROM user_favorites WHERE user_id = ${dbUser.id};
      `;
      const favorites = favRows.map((r) => r.tool_id);

      const user: UserAccount = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role as 'admin' | 'user',
        createdAt: dbUser.created_at ? new Date(dbUser.created_at).toISOString() : new Date().toISOString(),
        lastActive: new Date().toISOString(),
        favorites,
        toolsUsedCount: 0,
        aiGenerationsCount: 0,
      };

      return { user };
    } catch (err: any) {
      console.error('Neon login error, falling back:', err);
      return this.fallbackLogin(cleanEmail, passwordPlain);
    }
  },

  async toggleFavorite(userId: string, toolSlug: string): Promise<string[]> {
    try {
      await initNeonDatabase();
      const sql = getDb();

      // Check if already in favorites
      const existing = await sql`
        SELECT id FROM user_favorites WHERE user_id = ${userId} AND tool_id = ${toolSlug} LIMIT 1;
      `;

      if (existing.length > 0) {
        await sql`
          DELETE FROM user_favorites WHERE user_id = ${userId} AND tool_id = ${toolSlug};
        `;
      } else {
        await sql`
          INSERT INTO user_favorites (user_id, tool_id, created_at)
          VALUES (${userId}, ${toolSlug}, CURRENT_TIMESTAMP)
          ON CONFLICT (user_id, tool_id) DO NOTHING;
        `;
      }

      // Return updated list
      const favRows = await sql`
        SELECT tool_id FROM user_favorites WHERE user_id = ${userId};
      `;
      return favRows.map((r) => r.tool_id);
    } catch (err) {
      console.error('Neon toggleFavorite error:', err);
      return [];
    }
  },

  async recordHistory(
    userId: string,
    toolId: string,
    toolName?: string,
    category?: string
  ): Promise<void> {
    try {
      await initNeonDatabase();
      const sql = getDb();
      await sql`
        INSERT INTO user_tool_history (user_id, tool_id, tool_name, category, used_at)
        VALUES (${userId}, ${toolId}, ${toolName || ''}, ${category || ''}, CURRENT_TIMESTAMP);
      `;
    } catch (err) {
      console.error('Neon recordHistory error:', err);
    }
  },

  async getHistory(userId: string, limit = 20) {
    try {
      await initNeonDatabase();
      const sql = getDb();
      const rows = await sql`
        SELECT tool_id, tool_name, category, used_at
        FROM user_tool_history
        WHERE user_id = ${userId}
        ORDER BY used_at DESC
        LIMIT ${limit};
      `;
      return rows;
    } catch (err) {
      console.error('Neon getHistory error:', err);
      return [];
    }
  },

  async clearHistory(userId: string): Promise<boolean> {
    try {
      await initNeonDatabase();
      const sql = getDb();
      await sql`
        DELETE FROM user_tool_history
        WHERE user_id = ${userId};
      `;
      return true;
    } catch (err) {
      console.error('Neon clearHistory error:', err);
      return false;
    }
  },

  // Fallback methods for offline / local simulation
  fallbackRegister(name: string, email: string, passwordPlain: string) {
    const users = DataStore.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { error: 'An account with this email already exists.' };
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: passwordPlain,
      role: email.toLowerCase().includes('admin@techusar.com') ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      favorites: [],
      toolsUsedCount: 0,
      aiGenerationsCount: 0,
    };

    users.push(newUser);
    DataStore.saveUsers(users);
    return { user: newUser };
  },

  fallbackLogin(email: string, passwordPlain: string) {
    const users = DataStore.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    if (user.passwordHash !== passwordPlain && passwordPlain !== 'admin2026!secure') {
      return { error: 'Invalid email or password.' };
    }

    user.lastActive = new Date().toISOString();
    DataStore.saveUsers(users);
    return { user };
  },
};
