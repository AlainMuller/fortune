/**
 * Created with IntelliJ IDEA.
 * User: Alain Muller
 * Date: 07/09/13
 * Module de gestion des citations
 */
var mongo = require('mongodb');


var dbName = "fortune";
var collName = "quotes";


var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db(dbName, server);

db.open(function (err, db) {
    if (!err) {
        console.log("Connected to '" + dbName + "' database");
        db.collection(collName, {strict: true}, function (err, collection) {
            if (err) {
                console.log("The '" + collName + "' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
            else {
                console.log("Successfully connected to the collection '" + collName + "'");
            }
        });
    }
});

exports.findById = function (req, res) {
    var id = req.params.id;
    console.log('Retrieving quote: ' + id);
    db.collection(collName, function (err, collection) {
        collection.findOne({'_id': new BSON.ObjectID(id)}, function (err, item) {
            res.send(item);
        });
    });
};

exports.findByAuthor = function (req, res) {
    var author = req.params.author;
    console.log('Retrieving quote by author: ' + author);
    db.collection(collName, function (err, collection) {
        collection.findOne({'author': author}, function (err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function (req, res) {
    db.collection(collName, function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};

exports.addQuote = function (req, res) {
    var quote = req.body;
    console.log('Adding quote: ' + JSON.stringify(quote));
    db.collection(collName, function (err, collection) {
        collection.insert(quote, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateQuote = function (req, res) {
    var id = req.params.id;
    var quote = req.body;
    console.log('Updating quote: ' + id);
    console.log(JSON.stringify(quote));
    db.collection(collName, function (err, collection) {
        collection.update({'_id': new BSON.ObjectID(id)}, quote, {safe: true}, function (err, result) {
            if (err) {
                console.log('Error updating quote: ' + err);
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(quote);
            }
        });
    });
};

exports.deleteQuote = function (req, res) {
    var id = req.params.id;
    console.log('Deleting quote: ' + id);
    db.collection(collName, function (err, collection) {
        collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
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

    db.collection(collName, function (err, collection) {
        collection.insert(sampleQuotes, {safe: true}, function (err, result) {
            if (err)
                throw err;
            console.log("SUCCESS! " + result.length + " items created.");
        });
    });
};