/**
 * Created with IntelliJ IDEA.
 * User: Alain Muller
 * Date: 07/09/13
 */
// Dépendances globales de l'application
var express = require('express');
var http = require('http');
var path = require('path');
// Modules locaux
var routes = require('./routes');
var quotes = require('./routes/quotes');

var app = express();

// Configuration générale
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Gestion des traces en mode développement
if ('development' == app.get('env')) {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
}

// Affichage de l'application
app.get('/', routes.index);

// Gestion des citations
app.get('/quotes', quotes.findAll);
app.get('/quotes/:id', quotes.findById);
app.get('/quotes/author/:author', quotes.findByAuthor);
//app.post('/quotes', quotes.addQuote);
//app.put('/quotes/:id', quotes.updateQuote);
//app.delete('/quotes/:id', quotes.deleteQuote);


// Lancement du serveur
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
