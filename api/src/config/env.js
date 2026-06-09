import dotenv from "dotenv";

dotenv.config({ quiet: true });

const numberFromEnv = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: numberFromEnv(process.env.PORT, 5050),
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:5173",
};
