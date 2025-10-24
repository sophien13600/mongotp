import { Router } from "express";
import Produit from "../models/Produit.js";

const router = Router();


router.post("/", async (req, res) => {
    try{
        const produit = new Produit(req.body);
        const addedProduct = await produit.save();
        res.status(201).json(addedProduct); 
    }catch(err){
        console.log(err);
        res.status(400).json({erreur: err.message}); 
    }
});

router.get("/", async (req, res) => {
    const produits = await Produit.find();
    res.status(200).json(produits);
});


router.get("/etudiant", async(req, res) => {
    try{
        const prod = await Produit.find().populate("etudiantId", "prenom nom");
        res.status(201).json(prod);

    }catch(err){
    res.status(404).json({erreur: err.message});
    }
})

router.get("/:id", async (req, res) => {
    try{
        const prod = await Produit.findById(req.params.id);
        prod ? res.status(200).json(prod) 
             : res.status(404).json({erreur: "Produit non trouvé avec cet ID"});
    }catch(err){
        res.status(404).json({erreur: err.message});
    }
});
export default router;