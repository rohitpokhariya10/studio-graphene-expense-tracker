import dotenv from "dotenv";

dotenv.config({ quiet: true });

const numberFromEnv = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const listFromEnv = (value, fallback) =>
  (value ?? fallback)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: numberFromEnv(process.env.PORT, 5050),
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:5173",
  CLIENT_URLS: listFromEnv(process.env.CLIENT_URL, "http://localhost:5173"),
  MONGO_URI: process.env.MONGO_URI,
};
