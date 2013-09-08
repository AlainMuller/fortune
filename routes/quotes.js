/**
 * Created with IntelliJ IDEA.
 * User: Alain Muller
 * Date: 07/09/13
 * Module de gestion des citations
 */
var mongo = require('mongodb');

// Chargement des paramètres de configuration de l'appli (infos BDD...)
var cfg = require('../config');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

// Configuration de l'accès à la BDD MongoDB
var server = new Server(cfg.mongo.hostname, cfg.mongo.port, {auto_reconnect: true});
db = new Db(cfg.mongo.dbName, server);

/**
 * Connexion à la BDD
 */
db.open(function (err, db) {
    if (!err) {
        console.log("Connecté à la BDD '" + cfg.mongo.dbName + "'");
        db.collection(cfg.mongo.collName, {strict: true}, function (err, collection) {
            if (err) {
                console.log("La Collection '" + cfg.mongo.collName + "' n'existe pas => On la crée avec des données factices...");
                populateDB();
            }
            else {
                console.log("Connexion effectuée avec succès à la collection '" + cfg.mongo.collName + "'");
            }
        });
    }
});

/**
 * Recherche d'une citation depuis son id interne
 */
exports.findById = function (req, res) {
    var id = req.params.id;
    console.log("Recherche de la citation d\id : " + id);
    db.collection(cfg.mongo.collName, function (err, collection) {
        collection.findOne({'_id': new BSON.ObjectID(id)}, function (err, item) {
            res.send(item);
        });
    });
};

/**
 * Recherche de citations par auteur
 */
exports.findByAuthor = function (req, res) {
    var author = req.params.author;
    console.log("Recherche des citations de l'auteur '" + author + "'");
    db.collection(cfg.mongo.collName, function (err, collection) {
        collection.findOne({'author': author}, function (err, item) {
            res.send(item);
        });
    });
};

/**
 * Recherche de toutes les citations de la base
 */
exports.findAll = function (req, res) {
    db.collection(cfg.mongo.collName, function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};

/**
 * Ajout d'une citation en base
 */
exports.addQuote = function (req, res) {
    var quote = req.body;
    console.log("Ajout de la citation : '" + JSON.stringify(quote) + "'");
    db.collection(cfg.mongo.collName, function (err, collection) {
        collection.insert(quote, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error': "Une erreur est survenue"});
            } else {
                console.log("Ajout OK : '" + JSON.stringify(result[0]) + "'");
                res.send(result[0]);
            }
        });
    });
};

/**
 * Mise à jour d'une citation en base
 */
exports.updateQuote = function (req, res) {
    var id = req.params.id;
    var quote = req.body;
    console.log("Mise à jour de la citation : '" + id + "'");
    console.log(JSON.stringify(quote));
    db.collection(cfg.mongo.collName, function (err, collection) {
        collection.update({'_id': new BSON.ObjectID(id)}, quote, {safe: true}, function (err, result) {
            if (err) {
                console.log("Une erreur est survenue : " + err);
                res.send({'error': "Une erreur est survenue : " + err});
            } else {
                console.log("Mise à jour OK : " + result + " citations(s) traitées");
                res.send(quote);
            }
        });
    });
};

/**
 * Suppression d'une citation en base
 */
exports.deleteQuote = function (req, res) {
    var id = req.params.id;
    console.log("Suppression de la citation : '" + id + "'");
    db.collection(cfg.mongo.collName, function (err, collection) {
        collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function (err, result) {
            if (err) {
                console.log("Une erreur est survenue : " + err);
                res.send({'error': "Une erreur est survenue : " + err});
            } else {
                console.log("Suppression OK : " + result + " citations(s) supprimée(s)");
                res.send(req.body);
            }
        });
    });
};

/**
 * Méthode d'initialisation de la BDD depuis un fichier JSON. Appelée au démarrage du serveur ssi la BDD est vierge
 */
var populateDB = function () {

    var sampleQuotes = require('../public/sample_quotes.json');

    db.collection(cfg.mongo.collName, function (err, collection) {
        collection.insert(sampleQuotes, {safe: true}, function (err, result) {
            if (err)
                throw err;
            console.log("SUCCESS! " + result.length + " items created.");
        });
    });
};