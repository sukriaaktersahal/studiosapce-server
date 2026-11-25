// auth-token route file
import { Router } from "express";
import jwt from "jsonwebtoken";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

const router = Router();

router.get("/", async (req, res) => {
  // user from better-auth session
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }


  //JWT with user information 
  const token = jwt.sign(
    { 
      id: session.user.id, 
      email: session.user.email, 
      name: session.user.name 
    },
    process.env.BETTER_AUTH_SECRET!, 
    { expiresIn: "1d" } 
  );

  // token set as an HTTPOnly cookie 
  res.cookie("jwt_token", token,{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.json({ success: true, token });
});

export default router;