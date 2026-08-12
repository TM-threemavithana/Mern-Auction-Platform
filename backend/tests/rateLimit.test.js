import test from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter } from "../middlewares/rateLimit.js";

test("rate limiter permits requests up to its configured maximum", () => {
  const limiter = createRateLimiter({ windowMs: 60000, max: 2, keyPrefix: "test" });
  const req = { ip: "127.0.0.1" };
  const res = { set() {} };
  let called = 0;
  const next = (error) => { if (error) throw error; called += 1; };
  limiter(req, res, next);
  limiter(req, res, next);
  assert.equal(called, 2);
});

test("rate limiter rejects requests beyond its configured maximum", () => {
  const limiter = createRateLimiter({ windowMs: 60000, max: 1, keyPrefix: "blocked" });
  const req = { ip: "127.0.0.2" };
  const res = { set() {} };
  limiter(req, res, () => {});
  let received;
  limiter(req, res, (error) => { received = error; });
  assert.equal(received.statusCode, 429);
});
