import dotenv from "dotenv";
import path from "node:path";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "../db.js";
import { registerSchema } from "./auth.schema.js";

const envPath = path.resolve(process.cwd(), "..", ".env");
dotenv.config({ path: envPath });
dotenv.config();

const trustedOrigins = (
  process.env.BETTER_AUTH_TRUSTED_ORIGINS || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins,
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          registerSchema.parse({
            name: user.name,
            email: user.email,
            password: "valid_placeholder",
          });
        },
      },
    },
  },
});
