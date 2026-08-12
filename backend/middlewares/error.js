class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal server error.";
    err.statusCode = err.statusCode || 500;

    if (err.name === "JsonWebTokenError") {
        const message = "Json Web Token is invalid, Try again.";
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError") {
        const message = "Json Web Token is expired, Try again.";
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    if (err.code === 11000) {
        err = new ErrorHandler("A record with that value already exists.", 409);
    }

    
    const errorMessage = err.errors 
        ? Object.values(err.errors).map(error => error.message).join(", ") // join the messages into a single string
        : err.message; 
    const statusCode = err.statusCode || 500;
    const message = statusCode >= 500 && process.env.NODE_ENV === "production"
        ? "An unexpected error occurred. Please try again later."
        : errorMessage;
    if (statusCode >= 500) console.error(err);
    return res.status(statusCode).json({
        success: false,
        message,
    });
};

export default ErrorHandler;
