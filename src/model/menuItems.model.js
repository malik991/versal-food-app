import mongoose from "mongoose";

// schema for size and extringredients
const extraPriceSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

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
    sizes: { type: [extraPriceSchema] },
    extraIngredients: { type: [extraPriceSchema] },
  },
  { timestamps: true }
);

const MenuModel =
  mongoose.models?.MenuItem || mongoose.model("MenuItem", MenuSchema);

export default MenuModel;
