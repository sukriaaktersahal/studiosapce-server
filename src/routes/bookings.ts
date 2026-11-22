// booking details file
import { Router } from "express";
import { ObjectId } from "mongodb";
import { db } from "../lib/auth";
import { verifyJWT } from "../middleware/auth";

const router = Router();
const bookingsCollection = db.collection("bookings");

// create new booking (Protected - JWT)
router.post("/", verifyJWT, async (req, res) =>{
  const { studioId, startTime, endTime } = req.body;

  // prevent double booking 
  const conflict = await bookingsCollection.findOne({
    studioId,
    status: "Confirmed",
    startTime: { $lt: new Date(endTime) },
    endTime: { $gt: new Date(startTime) },
  });

  if(conflict){
    return res.status(409).json({ error: "Time slot already booked" });
  }

  const bookingData ={
    studioId,
    userEmail: (req as any).user.email,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    status: "Pending",
    createdAt: new Date(),
  };

  const result = await bookingsCollection.insertOne(bookingData);
  res.status(201).json(result);
});

// own user bookings (Protected - JWT)
router.get("/my-bookings", verifyJWT, async (req, res)=> {
  const bookings = await bookingsCollection
    .find({ userEmail: (req as any).user.email})
    .toArray();
  res.json(bookings);
});

// cancel booking (Protected - JWT)
router.put("/:id/cancel", verifyJWT, async (req, res)=> {
  const result = await bookingsCollection.updateOne(
    { _id: new ObjectId(req.params.id as string)},
    { $set: { status: "Cancelled" } }
  );
  res.json(result);
});

export default router;