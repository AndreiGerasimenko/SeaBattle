const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (userId) => {
    const token = jwt.sign({ userId }, config.get("jwtSecret"), {
        expiresIn: "2h",
    });

    const refreshToken = jwt.sign({ userId }, config.get("jwtSecret"), {
        expiresIn: "4h",
    });
      
    return [token, refreshToken];
}