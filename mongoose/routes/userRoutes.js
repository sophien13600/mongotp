 import{ Router} from "express";
 const router=Router();
 import {User} from "../models/User.js";

 
 // CREATE
 router.post("/", async(req, res) =>{
 try{
 const user =new User(req.body);
 const savedUser=await user.save();
 res.status(202).json(savedUser);
 } catch(err) {
 res.status(401).json({ error:err.message});
 }
 });

 router.get("/", async (req, res) => {
 const users = await User.find();
 res.json(users);
 });
 // READ - un utilisateur
 router.get("/:id", async (req, res) => {
 try {
 const user = await User.findById(req.params.id);
 if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
 res.json(user);
 } catch (err) {
 res.status(400).json({ error: err.message });
 }
 });

 // UPDATE
 router.put("/:id", async(req, res) =>{
 try{
 const user=await User.findByIdAndUpdate(req.params.id, req.body, {
 new:true,
 });
 if(!user) return res.status(404).json({ error:"Utilisateur non trouvé" });
 res.json(user);
 } catch(err) {
 res.status(400).json({ error:err.message});
 }
 });
 // DELETE
 router.delete("/:id", async(req, res) =>{
 try{
 const user=await User.findByIdAndDelete(req.params.id);
 if(!user) return res.status(404).json({ error:"Utilisateur non trouvé" });
 res.json({ message:"Utilisateur supprimé"});
 } catch(err) {
 res.status(400).json({ error:err.message});
 }
 });
 export default router;
