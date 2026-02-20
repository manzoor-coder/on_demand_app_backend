import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
} from "../controllers/bookingController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const router = Router();

// User books service
router.post("/", authenticate, authorizeRoles("USER"), createBooking);

// User sees own bookings
router.get("/my", authenticate, authorizeRoles("USER"), getMyBookings);

// Admin updates status
router.put(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  updateBookingStatus
);

export default router;