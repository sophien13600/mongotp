import Vente from "../models/Vente";

const caTotal = await Vente.aggregate([
  { $group: { _id: null, cA: { $sum: "$montantLigne" } } }
])
console.log(caTotal);

//ca par type de magasin
const caType = awiat Vente.aggregate([
  {
    $lookup: {
      from: "magasins",
      localField: "magasin",   
      foreignField: "_id",
      as: "magasin"
    }
  },
  
  { $unwind: "$magasin" },

  
  {
    $match: {
      "magasin.type": { $in: ["market", "super", "city", "express", "hyper"] }
    }
  },

  
  {
    $group: {
      _id: "$magasin.type",
      totalVentes: { $sum: "$montantLigne" }, 
      nombreVentes: { $sum: 1 }               
    }
  },

  
  {
    $sort: { totalVentes: -1 }
  }
]);
console.log(caType);


const venteParProduit = await Vente.aggregate([
  {
    $lookup: {
      from: "produits",
      localField: "produit",   
      foreignField: "_id",
      as: "produit"
    }
  },
  { $unwind: "$produit" },

  {
    $group: {
      _id: "$produit.categorie",
      totalVentes: { $sum: "$montantLigne" }, 
      nombreVentes: { $sum: 1 }               
    }
  },
  {
    $sort: { totalVentes: -1 }
  }
]);

console.log(venteParProduit);
