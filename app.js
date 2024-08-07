//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const nodemailer = require('nodemailer');
const mongodb = require('mongodb');
const mongoose = require("mongoose");
const _ = require("lodash");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

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

const NoteSchema = new mongoose.Schema ({

  userId: String,
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

const Note = mongoose.model("Note", NoteSchema);

const userSchema = new mongoose.Schema ({

  username: { type: String, unique: true },
  firstName: String,
  lastName: String, 
  password: String,
  email: String,
  notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}], 
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

app.get("/", function(req, res){
  
  res.render("home");
  
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

// step one in creating account
app.get("/createNote", function(req, res){
  if(req.isAuthenticated()) {
    res.render("createNote");
   } else {
    res.redirect("/")
   }

   res.render("createNote");
});

app.get("/user/note", function(req, res){

  if(!req.isAuthenticated() || !req.user.id) {

    res.redirect("/")

  } else {

    Note.find({userId: req.user.id}, function(err, userNotes){
      if (err){
        console.log(err);
        res.redirect("/")
      } else {

        if (userNotes) {
          res.render("note", {notesForPage: userNotes});
        } 
      }
    })
  }
})

app.get("/userHome", function(req, res){

  if(!req.isAuthenticated() || !req.user.id) {

    res.redirect("/")

  } else {
    
    Note.find({userId: req.user.id}, function(err, userNotes){

      if (err){
          console.log(err);
          res.redirect("/")
      } else {

        if (userNotes) {
          
          res.render("userHome", {notesForPage: userNotes});
        }
      }
    })
  }
});

app.get("/features", function(req, res){
  res.render("features");
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact", {msg: ""});
});

app.get("/editProfile", function(req, res){
  res.render("editProfile");
});

app.get("/composeNote", function(req, res){
   if(req.isAuthenticated()) {
    res.render("composeNote");
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

app.get("/notes/:noteId", function(req, res){
  const requestedNoteId = req.params.noteId;

  Note.findOne({_id: requestedNoteId}, function(err, singleNote){
    if(err) {
      console.log(err)
    } else {
      res.render("note", {
        id: requestedNoteId,
        title: singleNote.title,
        content: singleNote.content
      })
    }
  })
});  

app.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.post("/searchNotes", function(req, res){

  const yourUserId = req.user.id;
  const yoursearchedTitle = req.body.searchedNoteValue;
  
  Note.find({userId: yourUserId, title: {$regex: yoursearchedTitle, $options:'i'}}, function(err, searchedNotes){
    if(err) {
      console.log(err)
    } else {
        res.render("userHome", {notesForPage: searchedNotes})
      }      
    } 
  )
});

app.post("/compose", function(req, res){

  const yourUserId = req.user.id;
  const yourNoteTitle = req.body.noteTitle;
  const yourNoteContent = req.body.noteBody; 
  
  const newNote = new Note ({
    userId: yourUserId,
    title: yourNoteTitle,
    content: yourNoteContent
  });

  User.findOne({_id: yourUserId}, function(err, foundUser){
    if(err) {
      console.log(err)
    } else {
      
      foundUser.notes.push(newNote.id);

      foundUser.save();
      newNote.save(function(err){
        if (!err){
            res.redirect("/userHome");
        }
      });        
    } 
  })
});

app.post("/selectEdit", function(req, res){
  
  const noteId = req.body.selectedEdit;

  Note.findOne({_id: noteId}, function(err, foundNote){
    if(err) {
      console.log(err)
    } else {

      res.render("editNote", {title: foundNote.title, content: foundNote.content, id: foundNote.id})
    }
  })
});

app.post("/edit", function(req, res){
  
  const noteId = req.body.editBtn;
  const editTitle = req.body.editTitle;
  const editBody = req.body.editBody;
  const filter = {_id: noteId};

  Note.findOneAndUpdate(filter, {"$set": {title: editTitle, content: editBody}}, function(err){
    if(err) {
      console.log(err)
    } else {
      res.redirect("/userHome")
    }
  })
});

app.post("/delete", function(req, res){
  
  const noteId = req.body.selectedNote;

  Note.findOneAndDelete({_id: noteId}, function(err){
    if(err) {
      console.log(err)
    } else {
      res.redirect("/userHome")
    }
  })
});

app.post("/register", function(req, res){

  User.register(new User({
    username: req.body.username.trim(), 
    firstName: req.body.firstName.trim(), 
    lastName: req.body.lastName.trim(), 
    email: req.body.email.trim()}), req.body.password.trim(),
     function(err, user){

    if (err) {
      
      return res.render("register");

    } else {

      passport.authenticate("local")(req, res, function(){

        res.redirect("/createNote");

      })
    }
  })
});

app.post("/login", function(req, res){

  const user = new User({
    username: req.body.username.trim(),
    password: req.body.password.trim(),
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
            res.redirect('/userHome')
          })
        })
      }
    }
  })
});

app.post("/createNote", function(req, res){

  const yourUserId = req.user.id;
  const yourNoteTitle = req.body.firstNoteTitle;
  const yourNoteContent = req.body.firstNoteBody;

  const newNote = new Note ({
    userId: yourUserId,
    title: yourNoteTitle,
    content: yourNoteContent
  }); 

  User.findOne({id: yourUserId}, function(err, foundUser){

    if(err) {
      console.log(err)
    } else {
      
      foundUser.notes.push(newNote.id)

      foundUser.save();
      newNote.save(function(err){
        if (!err){
            res.redirect("/userHome");
        }
      });      
    }
  })
});

app.post("/sendEmail", function(req, res) {
  const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: '"Nodemailer Contact" <process.env.EMAIL>', // sender address
    to: "c_murphy343@yahoo.com", // list of receivers
    subject: "Node Contact Request", // Subject line
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);
 
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  res.render("contact", {msg: "Email has been sent"});
 
});


app.use((req, res, next) => {
  const error = new Error('Page not found....head back to the home page.');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  
if(error.status === 404) {
  res.render("error", {message: error.message});
}

if(error.status === 400 || error.status === 401 || error.status === 408) {
  res.render("error", {message: "Well this is awkward....please head back."})
}

if(error.status === 500) {
  res.render("error", {message: "Something broke, but it's fine, head back to the home page."})
}

});

let port = process.env.PORT || 3000;
if (port == null || port == "") {
  port = `0.0.0.0:$PORT`;
}

app.listen(port, function() {
  console.log("Server has started successfully ");
});

