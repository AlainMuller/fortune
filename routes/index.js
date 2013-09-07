/**
 * Created with IntelliJ IDEA.
 * User: Alain Muller
 * Date: 07/09/13
 * Module par défaut (affichage du template index)
 */

exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
};