import { Request, Response } from "express";
import Service from "../models/Service";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

export const createService = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, price, category } = req.body;

    if (!name || !price) {
      throw new AppError("Name and price are required", 400);
    }

    const service = await Service.create({
      name,
      description,
      price,
      category,
    });

    res.status(201).json(service);
  }
);

export const getAllServices = asyncHandler(
  async (req: Request, res: Response) => {
    const services = await Service.findAll();
    res.json(services);
  }
);