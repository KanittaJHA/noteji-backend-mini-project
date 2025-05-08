const errorHandler = (err, req, res, next) => {
    console.error("💥 Error caught:", {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : '🔒 hidden in production',
    });

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        error: true,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;
