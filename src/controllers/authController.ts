import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Role from "../models/Role";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userRole = await Role.findOne({ where: { name: role || "USER" } });

    if (!userRole) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role_id: userRole.id,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: Role,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: (user as any).Role.name,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: (user as any).Role.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};