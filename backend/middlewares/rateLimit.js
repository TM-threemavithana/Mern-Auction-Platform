import ErrorHandler from "./error.js";

// Lightweight in-memory limiter for a single Node process. Deployments with
// multiple instances should use the same policy backed by Redis at the edge.
export const createRateLimiter = ({ windowMs, max, keyPrefix = "default" }) => {
  const requests = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = `${keyPrefix}:${req.ip}`;
    const entry = requests.get(key);
    const active = !entry || now - entry.startedAt >= windowMs
      ? { startedAt: now, count: 0 }
      : entry;

    active.count += 1;
    requests.set(key, active);
    if (active.count > max) {
      res.set("Retry-After", Math.ceil((windowMs - (now - active.startedAt)) / 1000));
      return next(new ErrorHandler("Too many requests. Please try again shortly.", 429));
    }
    return next();
  };
};
