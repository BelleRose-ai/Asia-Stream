import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", tmdbConfigured: Boolean(process.env.TMDB_API_KEY) });
  });

  // Server-side TMDB Proxy Route (keeps API key secure and hidden from the browser)
  app.get("/api/tmdb/*", async (req, res) => {
    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      return res.status(400).json({ error: "TMDB_API_KEY is not configured on the server environment." });
    }

    // Extract subpath (e.g., /tv/218230 or /search/multi or /trending/tv/week)
    const tmdbPath = req.path.replace(/^\/api\/tmdb/, "");
    const queryString = new URLSearchParams(req.query as Record<string, string>).toString();

    let targetUrl = `https://api.themoviedb.org/3${tmdbPath}`;
    const headers: Record<string, string> = { accept: "application/json" };

    if (tmdbApiKey.startsWith("eyJ")) {
      headers["Authorization"] = `Bearer ${tmdbApiKey}`;
      if (queryString) targetUrl += `?${queryString}`;
    } else {
      const separator = targetUrl.includes("?") ? "&" : "?";
      targetUrl += `${separator}api_key=${tmdbApiKey}${queryString ? `&${queryString}` : ""}`;
    }

    try {
      const tmdbRes = await fetch(targetUrl, { headers });
      const data = await tmdbRes.json();
      res.status(tmdbRes.status).json(data);
    } catch (err: any) {
      console.error("TMDB Proxy Error:", err);
      res.status(500).json({ error: "Failed to fetch from TMDB", details: err.message });
    }
  });

  // Vite middleware setup for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
