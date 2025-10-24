import fs from 'fs';
import mongoose from 'mongoose';
import { connect } from "mongoose";
import Client from './models/Client.js';
import Magasin from './models/Magasin.js';
import Produit from './models/Produit.js';
import Vente from './models/Vente.js';



const dataRaw = JSON.parse(fs.readFileSync('./carrefour_dataset.json', 'utf8'));
//const data = convertExtendedJSON(dataRaw);

(async () => {
    await connect('mongodb://127.0.0.1:27017/tp_carrefour');
    await mongoose.connection.dropDatabase();

    await Client.insertMany(dataRaw.clients);
    await Magasin.insertMany(dataRaw.magasins);
    await Produit.insertMany(dataRaw.produits);
    await Vente.insertMany(dataRaw.ventes);

    console.log('✅ Données importées avec succès');
    process.exit();
})();
