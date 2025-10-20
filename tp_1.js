db.etudiants.insertOne(
    {
        prenom: "Nina",
        nom: "Lambert",
        age: 22,
        ville: "Bordeau",
        formation: "DWWM",
        notes: [15, 16, 14]
    }
);

db.etudiants.updateOne(
    {prenom: "David", nom: "Bernard"}, // filtre
    {$set: {actif: true}} // mise à jour
);

db.etudiants.updateMany({ville: "Lyon"}, {$inc: {age: 1}});

db.etudiants.updateMany(
    {prenom: "Chloé", nom: "Leroy"},
    {$set: {formation: "DWWM"}}
);

db.etudiants.deleteMany({actif: false});

db.etudiants.find().sort({age: 1});


db.etudiants.find({age: {$gt: 25}});
db.etudiants.aggregate([
    {$match: {age: {$gt: 25}}}, // $match: filtre
    {$project: {age: 1}}
]);


db.etudiants.find({age: {$gt: 20, $lte: 25}});
db.etudiants.aggregate(
    [
        {$match: {age: {$gt: 20, $lte: 25}}}
    ]
);

db.etudiants.find({ville: {$in: ["Paris", "Lille"]}});



db.etudiants.aggregate([
    {$addFields: {moyenne: {$avg: "$notes"}}},
    {$match: {moyenne: {$gte: 15}}}
]);

db.etudiants.aggregate([
    {$project: {moyenne: {$avg: "$notes"}}},
    {$match: {moyenne: {$gte: 15}}}
]);


db.etudiants.find(
    {notes: {$elemMatch: {$gte: 18}}}, 
    {prenom: 1, notes: 1}
);
db.etudiants.aggregate([
    {$project: {prenom: 1, notes: 1}},
    {$match: {notes: {$elemMatch: {$gte: 18}}}}
]);


db.etudiants.find({$expr: {$gte: [{$min: "$notes"}, 10]}});
db.etudiants.find({notes: {$not: {$elemMatch: {$lt: 10}}}});


db.etudiants.aggregate([
    {$group: {_id: "$formation", total: {$sum: 1}}}
]);
db.etudiants.aggregate([
    {$group: {_id: "$formation", total: {$sum: 1}}},
    {$project: {_id: 0, formation: "$_id", total: 1}}
]);

