import mongoose from "mongoose";

const MagasinSchema = new mongoose.Schema({
  nom:         { type: String, required: true },
  codeMagasin: { type: String, required: true, unique: true }, 
  type:        { type: String, enum: ["super", "hyper", "city", "market", "express"], required: true },
  ville:       { type: String, required: true },
  region:      { type: String },
  actif:       { type: Boolean, default: true }
}, { timestamps: true });


export default mongoose.model("Magasin", MagasinSchema);
