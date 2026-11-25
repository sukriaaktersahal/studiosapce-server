// CRUD operations for studios 
import { Router } from "express";
import { ObjectId } from "mongodb";
import { db } from "../lib/auth.js"; 
import { verifyJWT } from "../middleware/auth.js";

const router = Router();
const studiosCollection = db.collection("studios");

// all studios (public)
router.get("/", async (req, res)=>{
  const studios = await studiosCollection.find().toArray();
  res.json(studios);
});

// featured studioes for home page (public)
router.get("/featured", async (req, res)=> {
  const studios = await studiosCollection.find().sort({ rating: -1 }).limit(6).toArray();
  res.json(studios);
});

// see a fixed studio (public)
router.get("/:id", async (req, res) =>{
  const studio = await studiosCollection.findOne({ _id: new ObjectId(req.params.id) });
  res.json(studio);
});

// add new studio(protected with JWT)
router.post("/", verifyJWT, async (req, res)=> {
  const studioData ={
    ...req.body,
    createdAt: new Date(),
  };
  const result = await studiosCollection.insertOne(studioData);
  res.status(201).json(result);
});

// update studio (protected with JWT)
router.put("/:id", verifyJWT, async (req, res)=>{
  const id = req.params.id as string;
  const result = await studiosCollection.updateOne(
    { _id: new ObjectId(id)},
    { $set: req.body }
  );
  res.json({success: true, result});
});

// delete studio (protected with JWT)
router.delete("/:id", verifyJWT, async (req, res) =>{
  const id = req.params.id as string;
  const result = await studiosCollection.deleteOne({ _id: new ObjectId(id)});
  res.json({ success: true, result });
});

export default router;