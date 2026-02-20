import './models/Role';
import './models/User';
import User from './models/User';
import Role from "./models/Role";
import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/db";

import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(async () => {
    console.log("Database connected");
  
    // Create roles if not exist
    const roles = ["USER", "PROVIDER", "ADMIN"];
  
    for (const roleName of roles) {
      await Role.findOrCreate({
        where: { name: roleName },
      });
    }
  
    // Create default admin
    const adminRole = await Role.findOne({ where: { name: "ADMIN" } });
  
    const existingAdmin = await User.findOne({
      where: { email: "admin@test.com" },
    });
  
    if (!existingAdmin && adminRole) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
  
      await User.create({
        name: "Admin",
        email: "admin@test.com",
        password: hashedPassword,
        role_id: adminRole.id,
      });
  
      console.log("Default Admin Created");
    }
  
    app.use("/api/auth", authRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });