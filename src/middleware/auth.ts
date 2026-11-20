// middleware auth.ts file for verifying JWT tokens using BetterAuth
import { Request, Response, NextFunction } from "express";
import { jwtVerify, createRemoteJWKSet } from "jose";

// better-auth JWS 
const JWKS = createRemoteJWKSet(
  new URL(`${process.env.BETTER_AUTH_URL}/api/auth/jwks`)
);

export async function verifyJWT(req: Request, res: Response, next: NextFunction){
  // betterauth keep token default
  const token = req.cookies["better-auth.session_token"];

  if (!token) {
    // no token in cookies
    return res.status(401).json({error: "Unauthorized: No token provided"});
  }

  try {
    // verify token
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.BETTER_AUTH_URL,
      audience: process.env.BETTER_AUTH_URL,
    });
    
    // if token if valid
    (req as any).user = payload;
    next();
  }catch (error){
    return res.status(401).json({error: "Unauthorized: Invalid token"});
  }
}