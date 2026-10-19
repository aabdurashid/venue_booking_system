const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.authentication = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token berilmadi" })
        }

        const check = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        req.user = check
        next()
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: "Bu API ga murojaat qilishingizga huquqingiz yo'q" })
        }
        next()
    }
}

