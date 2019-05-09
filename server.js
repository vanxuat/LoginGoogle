const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys =require("./key")
const app = express();


app.set("view engine",'ejs');
app.set("views",'./views')

const db=require("./config/db");
const user=require("./models/users")
const cookieSession=require("cookie-session")

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());


passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
      },
      ( accessToken, refreshToken, profile, done) => {
        if(profile.id){
          user.findOne({where:{googleid:profile.id}}).then(us=>{
            if(us){
              return done(null,us);
            }
            else{
              user.create({googleid:profile.id,email:profile.emails[0].value,name:profile.displayName})
              .then((use)=>{
                  const {googleid,email,name}=use.dataValues
                    const newuser={googleid,email,name}
                    //console.log(newuser);

                    return done(null,newuser);
              })
              .catch(err=>console.log(err+''));
            }
          })
         

        }

       // console.log(profile)
        
       
       
      }
    )
);


passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.googleid);
});

passport.deserializeUser((id, done) => {
  user.findOne({ where: {googleid: id} }).then(project => {
    return done(null,project)
  })
});



app.get('/',(req,res)=>{
  res.render('index');
})




app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    }),(req,res)=>{
      res.send("dang nhap thanh cong");
    }
);

  app.get('/auth/google/callback', passport.authenticate('google', { 
    successRedirect: '/thanhcong',
    failureRedirect: '/thatbai'
}));



app.get('/thanhcong',(req,res)=>{
  res.send("da thanh nhap thanh cong");
})

app.get("/thatbai",(req,res)=>{
  res.send("dang nhap that bai");
})



const PORT = process.env.PORT || 5000;


db.sync().then(() => {
  app.listen(PORT, () => console.log('Da ket noi thanh cong'));
}).catch(error => {
  console.log(error + '');
})