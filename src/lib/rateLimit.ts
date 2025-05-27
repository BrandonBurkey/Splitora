import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rate limiting
// In production, use Redis or similar for distributed rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

export function rateLimiter(request: NextRequest) {
  // Get IP from headers or use a fallback
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0] : 'anonymous';
  const now = Date.now();
  
  // Get or initialize rate limit data for this IP
  const rateLimitData = rateLimit.get(ip) ?? { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  // Reset if window has passed
  if (now > rateLimitData.resetTime) {
    rateLimitData.count = 0;
    rateLimitData.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  // Increment request count
  rateLimitData.count++;
  rateLimit.set(ip, rateLimitData);
  
  // Check if rate limit exceeded
  if (rateLimitData.count > MAX_REQUESTS) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((rateLimitData.resetTime - now) / 1000).toString(),
        },
      }
    );
  }
  
  return null;
}

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimit.entries()) {
    if (now > data.resetTime) {
      rateLimit.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW); 