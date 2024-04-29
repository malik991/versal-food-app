import mongoose, { mongo } from "mongoose";
import { type } from "os";

const MenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "item name required"],
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    basePrice: {
      type: Number,
      required: [true, "price is mendatory"],
    },
  },
  { timestamps: true }
);

const MenuModel =
  mongoose.models?.MenuItem || mongoose.model("MenuItem", MenuSchema);

export default MenuModel;
