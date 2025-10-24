import {Router} from "express";
import Etudiant from "../models/Etudiant";


const router = Router();

router.post("/", async (req,res) =>{
    try{
        const etudiant = new Etudiant(req.body);
        const addedEtudiant = await etudiant.save();
        res.status(201).json(addedEtudiant);

    }catch(err){
        res.status(400).json({erreur: err.message})
    }
})

export default router 