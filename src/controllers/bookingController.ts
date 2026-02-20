import { Response } from "express";
import Booking from "../models/Booking";
import Service from "../models/Service";
import { AuthRequest } from "../middlewares/authMiddleware";

// USER creates booking
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { service_id, booking_date } = req.body;

    const service = await Service.findByPk(service_id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = await Booking.create({
      user_id: req.user.id,
      service_id,
      booking_date,
      status: "PENDING",
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// USER sees own bookings
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [Service],
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ADMIN updates status
export const updateBookingStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};