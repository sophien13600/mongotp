//1.	Jointure commandes → clients
//Liste les commandes avec les infos client (nom, email) + nb d’articles par commande.
db.commandes.aggregate([
    {
        $lookup:
            {
                from: "clients",
                localField: "clientId",
                foreignField: "_id",
                as :"client"
            }
    },
    {$unwind:"$client"},
    {
        $project:
            {
                "nom":"$client.nom",
                "email":"$client.email",
                nbArticle:{$sum: "$items.qte"}
            }
    },
])

//1.	Jointure commandes → clients
//Liste les commandes avec les infos client (nom, email) + nb d’articles par commande. supérieur a 9
db.commandes.aggregate([
    {
        $lookup:
            {
                from: "clients",
                localField: "clientId",
                foreignField: "_id",
                as :"client"
            }
    },
    {$unwind:"$client"},
    {
        $project:
            {
                "nom":"$client.nom",
                "email":"$client.email",
                nbArticle:{$sum: "$items.qte"}
            }
    },
    {
        $match:{nbArticle:{$gt:9}}
    }
])

//2.	Détail des lignes
//Dénormalise les commandes en lignes ($unwind items) et calcule totalLigne = qte * prixUnitaire.

db.commandes.aggregate([
    {$unwind:"$items"},
    {$project: {
            totalLigne: {$multiply:["$items.qte", "$items.prixUnitaire"]}
        }}
])

//2.	Détail des lignes
//Dénormalise les commandes en lignes ($unwind items) et calcule totalLigne = qte * prixUnitaire avec arrondi 2 chiffres apres la virgule et sans id

db.commandes.aggregate([
    {$unwind:"$items"},
    {$project: {
            _id: 0, statut:1,
            totalLigne:{$round: [{$multiply:["$items.qte", "$items.prixUnitaire"]},2]}
        }}
])


//3.	Top 5 produits par quantités vendues
//Compte le nombre total d’unités vendues par produit (hors commandes annulées), affiche le nom du produit.

db.commandes.aggregate([
    {$unwind: "$items"},
    {
        $lookup:
            {
                from: "produits",
                localField: "items.produitId",
                foreignField: "_id",
                as :"prod"
            }
    },
    {$unwind:"$prod"},
    {
        $project:
            {
                _id:0, statut:1,
                totalLigne: {$round: [{$multiply:["$items.qte", "$items.prixUnitaire"]}, 2]},
                libelle: "$prod.nom"
            }}
])

//3.	Top 5 produits par quantités vendues
//Compte le nombre total d’unités vendues par produit (hors commandes annulées), affiche le nom du produit.

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
])




//6.	Panier moyen global
//Panier moyen = CA total / nb de commandes payées/expédiées/livrées.


db.commandes.aggregate([
  { $match: { statut: { $in: ["livrée", "expediée", "payée"] } } },
  {
    $group: {
      _id: null,
      caTotal: { $sum: "$totalTTC" },
      nbCmd: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      caTotal: 1,
      nbCmd: 1,
      panierMoyen: { $round: [ { $divide: ["$caTotal", "$nbCmd"] }, 2 ] }
    }
  }
])

// 7.	Taux d’annulation
// % de commandes statut == "annulée" sur l’ensemble.

db.commandes.aggregate([

  {
    $group: {
      _id: null,
      nbCmd: { $sum: 1 },
      totalAnnul: { 
  			$sum: {
          $cond:[
            {$eq:["$statut","annulée"]},1,0
          ]
        }
    }
  }},
  {
    $project:{
      _id:0,
      totalAnnul:1,
      nbCmd: 1,
      tauxAnnule:
      {$round:[
      {$multiply:[
        {$divide: ["$totalAnnul", "$nbCmd"]},100
        ]
      },2
      ]
      }
  }}
])

//8.	Réachat sur 90 jours
//Liste les clients ayant ≥ 2 commandes sur les 90 derniers jours (à partir d’aujourd’hui).


db.commandes.aggregate([
  {$match: {createdAt:{$gte: new Date(Date.now() - 90*24*60*60*1000)}}},
  {$group: {_id: "$clientId", nbCmd: {$sum: 1}}},
  {$lookup: {from: "clients", localField: "_id", foreignField: "_id", as: "client"}},
  //{$unwind:"$client"},
  {$project: {
    _id:0,
    prenom: "$client.prenom",
    nom: "$client.nom",
    email: "$client.email",
    nbCmd:1
  }}
])


//9.	Ville la plus rentable
//CA total par ville de livraison (clients.adresse.ville), puis top 3.

db.commandes.aggregate([
  {$match: {statut: {$ne:"annulée"}}},
  {$lookup: {from: "clients", localField: "clientId", foreignField: "_id", as: "client"}},
  {$unwind:"$client"},
  {$group: {_id:"$client.adresse.ville", caTotal: {$sum: "$totalTTC"}}},
  {$sort: {caTotal: -1}},
  {$limit:3},
  {$project:{
    _id:0,
    ville:"$_id",
    caTotal: {$round: ["$caTotal",2]}
  }}
])

//10.	Statistiques par catégorie produit
//CA et quantités vendues par categorie

db.commandes.aggregate([
  {$unwind:"$items"},
  {$lookup:{from: "produits", localField: "items.produitId", foreignField:"_id", as: "prod"}},
  {$unwind:"$prod"},
  {$group:{_id:"$prod.categorie", qtTotal:{$sum:"$items.qte"}, caTotal:{$sum: {$multiply:["$items.qte","$items.prixUnitaire"]}}}},
  {$project:{
    _id:0,
    categorie:"$_id",
    qtTotal:1,
    caTotal:1
  }}
])

//clients sans commande
db.clients.aggregate([
    {$lookup:{from:"commandes", localField:"_id", foreignField:"clientId", as: "cmd"}},
    {$match:{cmd:{$size:0}}},
    {$project:{
        nom:1, prenom: 1
    }}
])