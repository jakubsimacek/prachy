const passport = require('passport');
const Account = require('./models/account');
const router = require('express').Router();
const ctrlAccount = require('./ctrls/account');
const ctrl = require('./ctrls/month');
//const { check, validationResult } = require('express-validator/check')
//const { matchedData, sanitize } = require('express-validator/filter')

// main view - display week - if not logged in, redirect to login screen
router.get('/', function(req, res) {
  if (!req.user) {
    res.redirect('/prachy/prihlaseni');
  }
  else {
    //res.render('index', {user: req.user});
    res.redirect('/prachy/mesice');
  }
});

// now we allow anybody to register, TODO: move to admin zone
router.get('/prachy/registrace', function(req, res) {
  console.log(req.query);
  if (req.query.error)
    res.render('register', {error: req.query.error});
  else
    res.render('register', {});
});

// this URL is hardcoded presumably !!!
//router.post('/register', function(req, res, next) {
router.post('/prachy/registrace', function(req, res, next) {
  console.log('registering user');
  //console.log(req.body.email);
  //let roles = [];
  //if (!req.body.email) {
    //res.redirect('/prachy/registrace?error=email');
    //return;
  //}
  console.log('registrujeme...')
  Account.register(new Account({username: req.body.username }), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }

    console.log('user registered!');

    res.redirect('/prachy/prihlaseni');
  });
});

router.get('/prachy/prihlaseni', function(req, res) {
  res.render('login', {user: req.user});
});

router.post('/prachy/prihlaseni', passport.authenticate('local'), ctrlAccount.postLogin);

// AUTENTICATED ZONE: beyond this point we allow only logged users
router.use(function (req, res, next) {
  if (!req.user) {
    console.log('... neprihlasen ...')
    res.redirect('/prachy/prihlaseni');
  }
  else {
    console.log(' ... jdeme dal ...')
    next();  // User found so continue to routes
  }
});

router.get('/prachy/odhlaseni', function(req, res) {
  req.logout();
  res.redirect('/prachy/prihlaseni');
});

// list months
router.get('/prachy/mesice', ctrl.getListMonths);

// add month
router.get('/prachy/mesic/novy', ctrl.getCreateMonth);
//router.post('/prachy/mesic/novy', ctrl.valPostCreateMonth, ctrl.postCreateMonth);
router.post('/prachy/mesic/novy', ctrl.postCreateMonth);

// edit month
router.get('/prachy/mesic/:year/:month', ctrl.getEditMonth);
//router.post('/prachy/mesic/:year/:month', ctrl.valPostEditMonth, ctrl.postEditMonth);
router.post('/prachy/mesic/:year/:month', ctrl.postEditMonth);


// edit types
router.get('/prachy/typy', ctrl.getType);
router.post('/prachy/typ/:type', ctrl.valPostType, ctrl.postType);
router.get('/prachy/typ/:type', ctrl.postType);
router.get('/prachy/typ/novy', ctrl.getCreateType);
router.post('/prachy/typ/novy', ctrl.valPostCreateType, ctrl.postCreateType);

module.exports = router;

