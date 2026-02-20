import { Router } from "express";
import { createService, getAllServices } from "../controllers/serviceController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const router = Router();

// Public
router.get("/", getAllServices);

// Admin only
router.post("/", authenticate, authorizeRoles("ADMIN"), createService);

export default router;