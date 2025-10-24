import mongoose from "mongoose";

const ProduitSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true }, 
  libelle:   { type: String, required: true },
  marque:    { type: String },
  categorie: { type: String, enum: ["Frais", "Épicerie", "DPH", "Textile", "Électronique"], required: true },
  prixBase:  { type: Number, required: true, min: 0 }
}, { timestamps: true });


export default mongoose.model("Produit", ProduitSchema);
