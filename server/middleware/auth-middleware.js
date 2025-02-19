const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("🔹 Received Authorization Header:", authHeader || "None"); // Debugging log

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.warn("⚠️ No token provided or incorrect format.");
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Verified. Decoded Payload:", payload);

        req.user = payload; // Attach decoded user data to `req.user`
        next();
    } catch (error) {
        console.error("❌ JWT Verification Error:", error.name, "-", error.message);

        // Handle Token Expiration
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token has expired. Please log in again.",
            });
        }

        // Handle Invalid Token
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token. Access denied.",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Unauthorized: Authentication failed.",
        });
    }
};

module.exports = authenticate;
