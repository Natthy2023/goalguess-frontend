export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Decode the simple token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
