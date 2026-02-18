import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL || "file:./data/meetup.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    initSchema(client);
  }
  return client;
}

async function initSchema(db: Client) {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS meetups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      proposed_date TEXT NOT NULL,
      location TEXT DEFAULT '',
      description TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meetup_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      can_host INTEGER DEFAULT 0,
      meat_lbs REAL DEFAULT 0,
      meat_type TEXT DEFAULT '',
      other_items TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (meetup_id) REFERENCES meetups(id) ON DELETE CASCADE
    );
  `);
}

export interface Meetup {
  id: number;
  title: string;
  proposed_date: string;
  location: string;
  description: string;
  created_at: string;
}

export interface Participant {
  id: number;
  meetup_id: number;
  name: string;
  email: string;
  can_host: number;
  meat_lbs: number;
  meat_type: string;
  other_items: string;
  created_at: string;
}

export const RECOMMENDED_MEAT_PER_PERSON_LBS = 0.5;
