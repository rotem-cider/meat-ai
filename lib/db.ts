import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

function getDbPath(): string {
  const candidates = [
    process.env.DB_PATH,
    path.join(process.cwd(), "data"),
    "/tmp",
  ];

  for (const dir of candidates) {
    if (!dir) continue;
    try {
      fs.mkdirSync(dir, { recursive: true });
      fs.accessSync(dir, fs.constants.W_OK);
      return path.join(dir, "meetup.db");
    } catch {
      continue;
    }
  }

  return path.join("/tmp", "meetup.db");
}

const DB_PATH = getDbPath();

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
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
