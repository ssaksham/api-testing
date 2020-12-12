const jwt = require('jsonwebtoken');
module.exports = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(400).send({
            "message": "Token not found"
        });
    }
    jwt.verify(req.headers.authorization, "Saksham", function(err, decoded) {
        if (err) {
            return res.status(400).send({
                "message": err
            });
        }
        return next();
    });
};