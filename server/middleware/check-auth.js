const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>
{
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,'ana are mere in secret');
    req.userData = {email: decodedToken.email, userId: decodedToken.userId}
    next();
  }
  catch(error){
    return res.status(401).json({
      message: 'Auth failed'
    })
  }
} ;
