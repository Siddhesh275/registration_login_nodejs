const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async (req,res,next) => {
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, "mynameissiddheshkulkarniwebdeveloper");
        console.log(verifyUser);

        next();
    }
    catch(e)
    {
        res.status(401).send(e);
    }
}
module.exports = auth;