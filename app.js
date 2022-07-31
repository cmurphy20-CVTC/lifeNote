//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_LINK, {useNewUrlParser: true});

const topicSchema = new mongoose.Schema({

  userId: String,
  topicId: String,
  title: String,
  createdAt: {
    type: Date, 
    default: () => Date.now()
  },
  updatedAt: {
    type: Date, 
    default: () => Date.now()
  }

})

const Topic = mongoose.model("Topic", topicSchema);

const postSchema = new mongoose.Schema ({

  userId: String,
  topicId: String,
  title: String,
  content: String,
  createdAt: {
    type: Date, 
    default: () => Date.now()
  },
  updatedAt: {
    type: Date, 
    default: () => Date.now()
  }

});

const Post = mongoose.model("Post", postSchema);

const userSchema = new mongoose.Schema ({

  username: { type: String, unique: true },
  firstName: String,
  lastName: String, // values: email address, googleId, facebookId
  password: String,
  provider: String, // values: 'local', 'google', 'facebook'
  email: String,
  topics: [topicSchema],
  posts: [postSchema],
  createdAt: {
    type: Date, 
    default: () => Date.now()
  },
  updatedAt: {
    type: Date, 
    default: () => Date.now()
  }
});

userSchema.plugin(passportLocalMongoose, {emailUnique: false});
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/post",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  
  User.findOrCreate({ username: profile.id },
    {
      provider: "google",
      email: profile._json.email
    }, function (err, user) {
    return cb(err, user);
  });
}
));

app.get("/auth/google", passport.authenticate('google', {
  
  scope: ["profile", "email"]

}));

app.get('/auth/google/post', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/post');
  });

app.get("/", function(req, res){
  
  res.render("home", {
    startingContent: homeStartingContent
    });
  
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/createTopic", function(req, res){
  if(req.isAuthenticated()) {
    res.render("createTopic");
   } else {
    res.redirect("/")
   }
});

app.get("/post", function(req, res){

  if(!req.isAuthenticated() || !req.user.id) {

    res.redirect("/")

  } else {

  User.findById(req.user.id, function(err, userPosts){
    if (err){
      console.log(err);
      res.redirect("/")
    } else {
      if (userPosts) {

        const postsForTopic = [];

        firstPostTopicId = userPosts.posts[0].topicId;

        console.log(firstPostTopicId)

        let posts = userPosts.posts;

        for (let i = 0; i < posts.length; i++) {
    
          if (posts.topicId === firstPostTopicId) {

            console.log("true")

            //postsForTopic.push(userPosts.posts.post);        
         }
        
        }    
        res.render("post", {postsForPage: postsForTopic});
      } else {
        res.redirect("/userHome")
      }
    }
  })
}});

app.get("/userHome", function(req, res){

  if(!req.isAuthenticated() || !req.user.id) {

    res.redirect("/")

  } else {

  User.findById(req.user.id, function(err, userTopics){
    if (err){
      console.log(err);
      res.redirect("/")
    } else {
      if (userTopics) {
       
        res.render("userHome", {topicsForPage: userTopics.topics});
      }
    }
  })
}});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/editProfile", function(req, res){
  res.render("editProfile");
});

app.get("/compose", function(req, res){
   if(req.isAuthenticated()) {
    res.render("compose");
   } else {
    res.redirect("/")
   }
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/compose", function(req, res){

  const yourPostId = req.user.id;
  const yourPostTitle = req.body.postTitle;
  const yourPostContent = req.body.postBody; 
  
  const newPost = new Post ({
    userId: yourPostId,
    title: yourPostTitle,
    content: yourPostContent
  });

  User.findById(req.user.id, function(err, userFound){
    if (err) {
      console.log(err)
    } else {
      if(userFound) {
        const yourTopicId = userFound.topics[0].id;

        newPost.topicId = yourTopicId;
        userFound.posts.push(newPost);
        userFound.save(function(){
          res.redirect('/post')
        })
      }
    }
  })

});

app.get("/posts/:postId", async function(req, res){
  const requestedPostId = req.params.postId;

  //console.log(requestedPostId)

  // let postObject = await User.findOne({

  //   'posts': {
    
  //   $elemMatch: {
    
  //   'title': requestedPostId
    
  //   }
    
  //   }
    
  //   });
    
    //const post = postObject.posts;
    
    // for (let i = 0; i < post.length; i++) {
    
    // if (post.title === requestedPostId) {
    //   console.log(post.title)
    // }
    
    // }
 
  });
  

app.post("/register", function(req, res){

  User.register(new User({
    username: req.body.username, 
    firstName: req.body.firstName, 
    lastName: req.body.lastName, 
    email: req.body.email}), req.body.password,
     function(err, user){

    if (err) {
      console.log(err);
      return res.render("register");
    } else {

      passport.authenticate("local")(req, res, function(){
        res.redirect("/createTopic");

      })
    }
  })
});

app.post("/login", function(req, res){

  const user = new User({

    username: req.body.username,

    password: req.body.password,

  });


  req.login(user, function(err){

    if (err) {
      console.log(err);

    } else {
      
      passport.authenticate("local")(req, res, function(){
        res.redirect("/userHome");
      });

    }
  })
});

app.post("/editProfile", function(req, res){

  if (!req.isAuthenticated()) {
    res.redirect("/")
  }

  const newPassword = req.body.newPassword;
  const oldPassword = req.body.currentPassword;

  User.findById(req.user.id, function(err, userFound){
    if (err) {
      console.log(err)
    } else {
      if(userFound) {
        userFound.changePassword(oldPassword, newPassword, function(err){
          userFound.save(function(){
            res.redirect('/post')
        })
       
        })
      }
    }
  })


});

app.post("/createTopic", function(req, res){

  const yourUserId = req.user.id;
  const yourTopicTitle = req.body.firstTopic;
  
  const newTopic = new Topic ({
    userId: yourUserId,
    title: yourTopicTitle

  });

  User.findById(req.user.id, function(err, userFound){
    if (err) {
      console.log(err)
    } else {
      if(userFound) {

        const newPost = new Post ({
          userId: yourUserId,
          topicId: newTopic.id,
          title: "Create a Post!",
          content: "What do you want to remember?"
        })

        userFound.topics.push(newTopic);
        userFound.posts.push(newPost);
        userFound.save(function(){
          res.redirect('/userHome')
        })
      }
    }
  })

});

app.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
