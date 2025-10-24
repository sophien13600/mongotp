import mongoose from "mongoose";

const VenteSchema = new mongoose.Schema({
  
  magasin: { type: mongoose.Schema.Types.ObjectId, ref: "Magasin", required: true },
  produit: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
  client:  { type: mongoose.Schema.Types.ObjectId, ref: "Client" }, 

  // Dénormalisation (anti-lookup pour analytics)
  categorieProduit: { type: String, enum: ["Frais", "Épicerie", "DPH", "Textile", "Électronique"], required: true },
  typeMagasin:      { type: String, enum: ["super", "hyper", "city", "market", "express"], required: true },

  // Mesures
  dateVente:    { type: Date, required: true },
  quantite:     { type: Number, required: true, min: 1 },
  prixUnitaire: { type: Number, required: true, min: 0 },
  remise:       { type: Number, required: true, min: 0, default: 0 },
  montantLigne: { type: Number, required: true, min: 0 } // (prixUnitaire - remise) * quantite
}, { timestamps: true });


export default mongoose.model("Vente", VenteSchema);
