var express = require('express');
var router = express.Router();
const passport = require('passport');
var mongoose = require('mongoose');

require('../auth/facebook');


router.get('/facebook', passport.authenticate('facebook',{
  scope:'email'
}));

router.get('/facebook/login',passport.authenticate('facebook',{
    failureRedirect:'/login'
}),function (req,res) {
    console.log(req.user._id);
    var userobjid = req.user._id
    req.session.user_id =  userobjid
    console.log('session userid is'+ req.session.user_id);
    res.render('dashboard');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('welcome', { title: 'Express' });
});

router.get('/loginpage', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

router.post('/signup',function (req,res,next) {
  try {
    var reqs = req.body;
    var save = {
      name: reqs.name,
      email: reqs.email,
      password: reqs.password
    }
    mongoose.model("User").create(save, (err, aircraftObj) => {
      res.render('login');
    });
  } catch (e) {
    console.log(e);
  }
});

// router.post('/dashboard',function (req,res,next) {
//   res.render('dashboard');
// });

router.get('/dashboard', function (req, res, next) {
  var s = req.session.user_id
  console.log(s);
  mongoose.model('User').find({ _id:s })
    .then((newSignupObj) => {
      console.log(newSignupObj);
      if (newSignupObj.length > 0) {
        res.render('profile',{newSignupObj:newSignupObj});

      }
  })
});

router.get('/logout', function (req, res) {
    console.log(req.session);
    req.session.destroy();
    req.logOut();
    // console.log(req.session);
    res.clearCookie('x_access_token');
    res.cookie('auth', false);
    res.redirect('/')
});
  
module.exports = router;
