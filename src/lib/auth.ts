// better-auth configuration file
import { betterAuth } from "better-auth";
import {mongodbAdapter} from "@better-auth/mongo-adapter";
import {jwt} from "better-auth/plugins";
import {MongoClient} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// MongoDB client setup
const client = new MongoClient(process.env.MONGODB_URI!);

// databaseName
const db = client.db("studiosapce");

export const auth = betterAuth({
  //MongoDB adapter
  database: mongodbAdapter(db, { client }),

  // email, password login enabled
  emailAndPassword:{
    enabled : true,
    requireEmailVerification : false, 
  },

  // JWT plugin 
  plugins: [
    jwt({
      jwt:{
        definePayload:({user}) => ({
          id: user.id,
          email: user.email,
          name: user.name,
        }),
      },
    }),
  ],


  // secret key(32+ character)
  secret: process.env.BETTER_AUTH_SECRET!,

  // base URL
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

  // request origin
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],
});

export { db, client };