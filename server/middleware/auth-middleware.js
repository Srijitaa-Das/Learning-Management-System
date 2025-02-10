const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("Received Authorization Header:", authHeader); // Debugging log

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Payload:", payload); // Debugging log
    
        req.user = payload;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
    
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token has expired",
            });
        }
    
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token"
        });
    }
    
};

module.exports = authenticate;
