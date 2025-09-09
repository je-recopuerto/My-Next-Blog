// Simple in-memory rate limiter
const attempts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (
  identifier: string, 
  maxAttempts: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { success: boolean; remaining: number; resetTime: number } => {
  const now = Date.now();
  const userAttempts = attempts.get(identifier);
  
  // Reset if window expired
  if (!userAttempts || now > userAttempts.resetTime) {
    attempts.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxAttempts - 1, resetTime: now + windowMs };
  }
  
  // Check if limit exceeded
  if (userAttempts.count >= maxAttempts) {
    return { 
      success: false, 
      remaining: 0, 
      resetTime: userAttempts.resetTime 
    };
  }
  
  // Increment counter
  userAttempts.count++;
  attempts.set(identifier, userAttempts);
  
  return { 
    success: true, 
    remaining: maxAttempts - userAttempts.count, 
    resetTime: userAttempts.resetTime 
  };
};
