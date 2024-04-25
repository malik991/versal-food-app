import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
