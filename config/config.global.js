/**
 * Created with IntelliJ IDEA.
 * User: Alain Muller
 * Date: 07/09/13
 * Fichier de configuration par défaut
 */
var config = module.exports = {};

config.env = 'development';
config.hostname = 'localhost';

// MongoDB
config.mongo = {};
config.mongo.hostname = 'localhost';
config.mongo.port = '27017';
config.mongo.dbName = "fortune";
config.mongo.collName= "quotes";

