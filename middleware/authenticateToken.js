import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ 
            error: true, 
            message: "Missing or malformed token" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err || !user?._id) {
            console.error("Invalid token:", err || "Missing user ID");
            return res.status(403).json({ 
                error: true, 
                message: "Invalid or expired token" });
        }

        req.user = user;
        // console.log("User authenticated:", req.user);
        next();
    });
}

export { authenticateToken };
