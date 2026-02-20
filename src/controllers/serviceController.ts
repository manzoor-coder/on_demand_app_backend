import { Request, Response } from "express";
import Service from "../models/Service";

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category } = req.body;

    const service = await Service.create({
      name,
      description,
      price,
      category,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};