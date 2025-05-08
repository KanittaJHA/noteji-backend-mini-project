import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const token = tokenFromHeader || req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({
            error: true,
            message: "Missing or malformed token"
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err || !user?._id) {
            console.error("Invalid token:", err || "Missing user ID");
            return res.status(403).json({
                error: true,
                message: "Invalid or expired token"
            });
        }

        req.user = user;
        next();
    });
}

export { authenticateToken };
