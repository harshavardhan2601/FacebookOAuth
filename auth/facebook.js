var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require("mongoose");
var keys = require('./key');
var signup = require('../models/user')

passport.serializeUser(function (user, done) {
    // console.log(user);
    done(null, user);
  });
  
  passport.deserializeUser(function (id, done) {
    mongoose.model('User').findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(
      new FacebookStrategy({
    clientID: keys.APP_ID,
    clientSecret: keys.APP_SECRET,
    profileFields:['email','displayName','photos'],
    callbackURL: "http://localhost:3400/facebook/login",
    proxy:true
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    mongoose.model('User').findOne({ facebook: profile.id }, function (err, user) {
        if (err) {
          throw err;
        }
        if (user) {
          // console.log(user);
          return done(null,user);
        } else {
          var newUser ={
            facebook:profile.id,
            name:profile.displayName,
            file_attach1:'https://graph.facebook.com/'+profile.id+'/picture?type=large',
            email:profile.emails[0].value
          }
          mongoose.model('User').create(newUser,function (err,userobj) {
            if (err) {
              throw err;
            } else {
              // req.session.user_id = userobj._id;
              // console.log(newUser);
              return done(null,userobj);
            }
          })
        }
      });
  }
));