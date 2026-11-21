// middleware auth.ts file for verifying JWT tokens using BetterAuth
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function verifyJWT(req: Request, res: Response, next: NextFunction){
  // better-auth save cookies as
  let token = req.cookies["jwt_token"];

  if(!token && req.headers.authorization?.startsWith("Bearer ")){
    token = req.headers.authorization.split(" ")[1];
  }

  // if no token found
  if(!token){
    return res.status(401).json({error: "Unauthorized: No token provided"});
  }

  try{
    const decoded = jwt.verify(token, process.env.BETTER_AUTH_SECRET!);
    (req as any).user = decoded;
    next();
  }catch (error){
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}