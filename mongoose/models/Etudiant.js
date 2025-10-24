import { Schema, model } from "mongoose";

const etudiant = new Schema({
    prenom:{type: String, require: true},
    nom:{type: String, require: true},
    email:{type: String, require: true, unique: true},
    note:[
        {
            type: Number, 
            min: 0, 
            max: 20
        }
    ],
    matieres:[{type: String}]
}, {timestamps: true});

export default model("Etudiant", etudiant);