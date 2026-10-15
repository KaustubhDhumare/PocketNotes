import * as SQLite from "expo-sqlite";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

let db: SQLite.SQLiteDatabase;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync("pocketnotes.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
}

export function getDatabase() {
  if (!db) {
    throw new Error(
      "Database has not been initialized. Call initDatabase() first.",
    );
  }

  return db;
}



export async function getAllNotes(): Promise<Note[]> {
  const database = getDatabase();

  return database.getAllAsync<Note>(
    'SELECT id, title, content, createdAt FROM notes ORDER BY createdAt DESC'
  );
}

export async function createNote(note: Note): Promise<void> {
  const database = getDatabase();

  await database.runAsync(
    'INSERT INTO notes (id, title, content, createdAt) VALUES (?, ?, ?, ?)',
    note.id,
    note.title,
    note.content,
    note.createdAt
  );
}

export async function updateNote(
  id: string,
  title: string,
  content: string
): Promise<void> {
  const database = getDatabase();

  await database.runAsync(
    'UPDATE notes SET title = ?, content = ? WHERE id = ?',
    title,
    content,
    id
  );
}

export async function deleteNote(id: string): Promise<void> {
  const database = getDatabase();

  await database.runAsync(
    'DELETE FROM notes WHERE id = ?',
    id
  );
}
