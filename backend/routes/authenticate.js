import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key_here';  

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Authorization token is missing or invalid');
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;  
    next();
  } catch (err) {
    return res.status(401).send('Invalid Token: ' + err.message);
  }
};