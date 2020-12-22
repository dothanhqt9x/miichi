const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const auth = async (req, res, next) => {
  const token = req.cookies.token || '';
  try {
    if (!token) {
      return res.status(401).json('You need to Login')
    }
    const decrypt = await jwt.verify(token, process.env.JWT_KEY);
    req.user = {
      id: decrypt.id,
      name: decrypt.name,
    };
    next();
  } catch (err) {
    return res.status(500).json(err.toString());
  }
};

module.exports = auth;
