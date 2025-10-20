// Top 5 produit 
db.commandes.aggregate([
  {$match: {statut: {$ne: "annulée"}}},
  {$unwind: "$items"},
  {$group: {
    _id: "$items.produitId",
    totalQte: {$sum: "$items.qte"}
    }
  },
  {$sort: {totalQte: -1}},
  {$limit: 5},
  {
    $lookup: {
      from: "produits",
      localField: "_id",
      foreignField: "_id",
      as: "prod"
    }
  },
  {$unwind: "$prod"},
  {$project: {
    _id: 0,
    libelle: "$prod.nom",
    totalQte: 1,
    idProd: "$prod._id"
  }}
]);

// CA mensuel
db.commandes.aggregate([
  {$match: {statut: {$ne: "annulée"}}},
  {
    $group: {
      _id: {
        $dateToString: {format: "%Y-%m", date: "$createdAt"}
      },
      CA: {$sum: "$totalTTC"}
    }
  },
  {
    $project: {_id: 0, periode: "$_id", CA: 1}
  },
  {$sort: {periode: -1}}
]);


// Top 5 clients par CA total
db.commandes.aggregate([
  {$match: {statut: {$ne: "annulée"}}},
  {$group: {_id: "$clientId", CA: {$sum: "$totalTTC"}}},
  {$sort: {CA: -1}},
  {$limit: 5},
  {
    $lookup: {
      from: "clients",
      localField: "_id",
      foreignField: "_id",
      as: "client"
    }
  },
  {$unwind: "$client"},
  {$project: {
    _id: 0,
    prenom: "$client.prenom",
    nom: "$client.nom",
    email: "$client.email",
    ville: "$client.adresse.ville",
    CA: 1
  }}
])