import test from "node:test";
import assert from "node:assert/strict";
import { validateEnvironment } from "../utils/environment.js";

test("environment validation reports missing production configuration", () => {
  const previous = { ...process.env };
  for (const key of ["MONGO_URI", "FRONTEND_URL", "JWT_SECRET_KEY", "JWT_EXPIRE", "COOKIE_EXPIRE"]) delete process.env[key];
  assert.throws(validateEnvironment, /Missing required environment variables/);
  Object.assign(process.env, previous);
});
