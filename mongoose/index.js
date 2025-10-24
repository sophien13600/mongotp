import express from "express"; 
import { connect } from "mongoose"; 
import cors from "cors"; 
// import userRoutes from "./routes/userRoutes.js";
import etudiantRoutes from "./routes/etudiantRoutes.js" 
import produitRoutes from "./routes/produitRoutes.js"

 const app = express();

 app.use(express.json());

//  app.use("/users", userRoutes);
app.use("/etudiant", etudiantRoutes);
app.use("/produits", produitRoutes);
app.use(cors());
 
 connect("mongodb://127.0.0.1:27017/dwwm_api")
 .then(() => console.log("Connecté à MongoDB"))
 .catch(err => console.error("Erreur MongoDB :", err));
 app.get("/", (req, res) => res.send("API MongoDB en Node.js"));
 app.listen(3000, () => console.log("Serveur lancé sur http://localhost:3000"));
