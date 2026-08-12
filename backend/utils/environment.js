const required = ["MONGO_URI", "FRONTEND_URL", "JWT_SECRET_KEY", "JWT_EXPIRE", "COOKIE_EXPIRE"];

export const validateEnvironment = () => {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET_KEY.length < 32) {
    throw new Error("JWT_SECRET_KEY must be at least 32 characters in production.");
  }
};
