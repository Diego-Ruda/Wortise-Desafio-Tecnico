import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import path from "node:path";
import { connectDB } from "./db.js";
import { auth } from "./auth/auth.js";
import { articlesRoutes } from "./articles/articles.routes.js";


dotenv.config();

const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS || FRONTEND_URL)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return FRONTEND_URL;
      return allowedOrigins.includes(origin) ? origin : FRONTEND_URL;
    },
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    message: "Servidor Hono funcionando correctamente",
  });
});

app.route("/api/articles", articlesRoutes);

const port = Number(process.env.PORT) || 3000;

connectDB().then(() => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
});
