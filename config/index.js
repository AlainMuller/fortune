/**
 * Created with IntelliJ IDEA.
 * User: Alain Muller
 * Date: 07/09/13
 * Fichier de configuration de l'application
 */
// Chargement du fichier de configuration (par défaut, celui de développement)
// TODO : Passer en mode prod
var env = process.env.NODE_ENV || 'development',
    cfg = require('./config.' + env);

module.exports = cfg;