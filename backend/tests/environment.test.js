import test from "node:test";
import assert from "node:assert/strict";
import { validateEnvironment } from "../utils/environment.js";

test("environment validation reports missing production configuration", () => {
  const previous = { ...process.env };
  for (const key of ["MONGO_URI", "FRONTEND_URL", "JWT_SECRET_KEY", "JWT_EXPIRE", "COOKIE_EXPIRE"]) delete process.env[key];
  assert.throws(validateEnvironment, /Missing required environment variables/);
  for (const key of Object.keys(process.env)) if (!(key in previous)) delete process.env[key];
  Object.assign(process.env, previous);
});

test("production rejects the mock payment provider", () => {
  const previous = { ...process.env };
  Object.assign(process.env, { NODE_ENV: "production", MONGO_URI: "mongodb://example.test/bidspirit", FRONTEND_URL: "https://app.example.test", JWT_SECRET_KEY: "a-secure-production-secret-with-over-32-chars", JWT_EXPIRE: "7d", COOKIE_EXPIRE: "7", PAYMENT_PROVIDER: "mock" });
  assert.throws(validateEnvironment, /non-mock payment provider/);
  for (const key of Object.keys(process.env)) if (!(key in previous)) delete process.env[key];
  Object.assign(process.env, previous);
});
