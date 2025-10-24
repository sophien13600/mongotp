import mongoose from "mongoose";

const CarteSchema = new mongoose.Schema({
  numeroCarte:  { type: String, unique: true, sparse: true },
  dateAdhesion: { type: Date },
  points:       { type: Number, default: 0, min: 0 }
}, { _id: false });

const ClientSchema = new mongoose.Schema({
  estPorteur:     { type: Boolean, required: true },        
  carte:          { type: CarteSchema },                    
  email:          { type: String, lowercase: true },
  anneeNaissance: { type: Number, min: 1900 },
  sexe:           { type: String, enum: ["H","F","X"], required: false }
}, { timestamps: true });


export default mongoose.model("Client", ClientSchema);
