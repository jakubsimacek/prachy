//mongoose = require('mongoose');


module.exports.postLogin = function (req, res) {
  console.log('post login ctrl');
  //console.log(req.user);
  //req.user.lastLogin = new Date();
  //req.user.email = 'e@m.l';
  //req.user.save(function(err) {
    //console.log(err);
  //});
  res.redirect('/');
}

