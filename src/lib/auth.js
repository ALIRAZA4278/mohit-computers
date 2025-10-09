import jwt from 'jsonwebtoken';

// Verify JWT token and return user data
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, userId: decoded.userId, email: decoded.email };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Get user from request (checks cookies or Authorization header)
export const getUserFromRequest = (request) => {
  try {
    // Try to get token from cookie
    let token = request.cookies.get('auth-token')?.value;

    // If not in cookie, try Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return { authenticated: false, error: 'No token provided' };
    }

    const verification = verifyToken(token);
    if (!verification.valid) {
      return { authenticated: false, error: 'Invalid token' };
    }

    return {
      authenticated: true,
      userId: verification.userId,
      email: verification.email
    };
  } catch (error) {
    return { authenticated: false, error: error.message };
  }
};
