import { Schema, Types, model } from "mongoose";

const prod = new Schema({
    etudiantId:{
        type: Schema.Types.ObjectId,
        ref: "Etudiant",
        require: true

    },


    libelle: {type: String, require: true},
    prix: {type: Number, require: true},
    provenance: {type: String, enum: ["France", "Canada"], default: "France"}
},{timestamps: true});

export default model("Produit", prod);