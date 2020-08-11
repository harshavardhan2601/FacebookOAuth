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

//login session//
router.post('/page', function (req, res, next) {
  var reqs = req.body;
  console.log(reqs);
  mongoose.model('User').findOne({ email: reqs.email, password: reqs.password })
    .then((Obj) => {
      console.log(Obj);
      if (Obj) {
        console.log(Obj._id);
        req.session.user_id = Obj._id;
        req.session.email_id = Obj.email;
        console.log('_id======' + req.session.user_id);
        console.log('_id======' + req.session.email_id);
        // console.log({ status: 1, massage: 'Success' });
        // res.send({ status: 1, 'data': Obj });
        // res.json({ 'data': Obj});
        res.redirect('dashboard');
      } else {
        res.send({ status: 2, massage: 'Failure' });
      }

    })
});


router.get('/page_veriy_user', function (req, res, next) {
  var u_id = req.session.user_id;
  var email = req.session.email_id;
  console.log(u_id)
  if (u_id != '' && u_id != undefined) {
    mongoose.model('User').findById({ _id : u_id,email:email }, function (err, data) {
      if (err) { console.log(err) }
      else {
        console.log(data);
        console.log("data")
        res.json({ "data": data });
      }

    });
  } else {
    res.json({ "data": 'failure' })
  }

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

router.get('/dashboard',function (req,res,next) {
  res.render('dashboard');
});

router.get('/Change',function (req,res,next) {
  res.render('change');
});

router.post('/changepassword',function (req,res,next) {
  var reqs = req.body;
  console.log(reqs);
  var s = req.session.user_id
  console.log(s);
  mongoose.model('User').findByIdAndUpdate({_id:s},{
    $set:{
      password: reqs.newpass
    }
  },function (err,pass) {
    if (err) {
      console.log(err)
    } else {
      console.log(pass);
      res.send({pass});
    }
  })
});


router.get('/profile', function (req, res, next) {
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
