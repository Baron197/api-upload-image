const jwt = require ('jsonwebtoken');

module.exports = {
    createJWTToken(payload){
        return jwt.sign(payload, "KucingBertasbih", { expiresIn : '12h' })
    }
}