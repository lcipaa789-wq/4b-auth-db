const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
// custom middleware function to verify the token
// needs to be middleware, we want to verify before we hit our routes
const verifyToken = (req, res, next) => {
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzQ1NTM3NzZ9.RKkKs28lmiunCXRHTZmi93ZHhB2eg39ehg6GW6XMIU

  // Go to Headers tab
  // Key: Authorization
  // Value: your-token

  // if our token exists, it will be sent in request headers
  // Authorization headers are for sending auth details/requirements like tokens
  const token = req.header("Authorization");
  console.log(token);

  if (!token) {
    // 401 - unauthorized
    // need to return response in middleware to exit function early
    return res.status(401).json({
      message: "failure",
      payload: "Unable to authorize user",
    });
  }

  // they have the token, let's verify it against the secret
  const tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // attach tokenData to our request
  req.username = tokenData.username;

  // end our function with next()
  // request will be routed to next middleware OR proper route
  next();
};

module.exports = verifyToken;
