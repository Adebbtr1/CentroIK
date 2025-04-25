import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Em produção, você usaria hash (bcrypt)
});

export const Admin = mongoose.model("Admin", AdminSchema);
