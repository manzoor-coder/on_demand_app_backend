import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import User from "./User";
import Service from "./Service";

class Booking extends Model {
  public id!: number;
  public user_id!: number;
  public provider_id!: number | null;
  public service_id!: number;
  public booking_date!: Date;
  public status!: string;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    booking_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("PENDING", "ACCEPTED", "REJECTED", "COMPLETED"),
        defaultValue: "PENDING",
    },
  },
  {
    sequelize,
    modelName: "Booking",
    tableName: "bookings",
    timestamps: true,
  }
);

// Associations
Booking.belongsTo(User, { foreignKey: "user_id" });
Booking.belongsTo(Service, { foreignKey: "service_id" });

export default Booking;