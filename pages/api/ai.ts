// --- pages/api/ai.ts ---

import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import Fuse from "fuse.js";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// Initialize DOMPurify for server-side HTML sanitization
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const ALLOWED_COMMANDS = [
  "help",
  "about",
  "projects",
  "skills",
  "experience",
  "contact",
  "certifications",
  "education",
  "sudo",
  "clear",
  "welcome"
];

const MONGO_URI = process.env.MONGODB_URI!;
const MONGO_DB = "Portfolio";

let cachedClient: MongoClient | null = null;

async function getClient(): Promise<MongoClient> {
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URI);
    await cachedClient.connect();
  }
  return cachedClient;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = (req.query.query as string)?.trim().toLowerCase();

  if (!query) {
    return res.status(400).json({ response: "No command entered." });
  }

  try {
    const client = await getClient();
    const db = client.db(MONGO_DB);
    const collection = db.collection("commands");

    // 1. Check for exact match
    if (ALLOWED_COMMANDS.includes(query)) {
      const result = await collection.findOne({ command: query });
      const response = DOMPurify.sanitize(result?.response ?? `Command '${query}' is not configured in the database.`);
      return res.json({ response });
    }

    // 2. Fuzzy match using Fuse.js
    const fuse = new Fuse(ALLOWED_COMMANDS, {
      threshold: 0.4,
      ignoreLocation: true,
      includeScore: true
    });
    const normalizedQuery = query.replace(/\s+/g, "").toLowerCase();
    const fuseResult = fuse.search(normalizedQuery);
    const bestMatch = fuseResult[0];

    if (bestMatch && typeof bestMatch.score === "number" && bestMatch.score < 0.4) {
      const suggestion = bestMatch.item;
      const dbResult = await collection.findOne({ command: suggestion });
      const response = DOMPurify.sanitize(dbResult?.response ?? `Command '${suggestion}' is not configured in the database.`);
      return res.json({ response });
    }

    // 3. Fallback: No good match found
    const fallback = `Command '${query}' not found. Type 'help' for a list of available commands.`;
    return res.json({ response: DOMPurify.sanitize(fallback) });

  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({
      response: "An internal error occurred. Please try again later."
    });
  }
}
