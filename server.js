const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys =require("./key")
const app = express();


const db=require("./config/db");
const user=require("./models/users")
const cookieSession=require("cookie-session")

// app.use(
//   cookieSession({
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     keys: [keys.cookieKey]
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());


passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
      },
      ( accessToken, refreshToken, profile, done) => {
       
        console.log(accessToken);
        console.log(profile);
       
       
      }
    )
);


// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id)
//     .then(user => {
//       done(null, user);
//     })
// });




app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    }),(req,res)=>{
      console.log(req)
    }
);

  app.get('/auth/google/callback', passport.authenticate('google'),(req,res)=>{
    console.log("phan req cua callback")
    console.log(req)
  });



const PORT = process.env.PORT || 5000;


db.sync().then(() => {
  app.listen(PORT, () => console.log('Da ket noi thanh cong'));
}).catch(error => {
  console.log(error + '');
})