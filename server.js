const dotenv = require("dotenv");
// import MongoStore from './node_modules/connect-mongo/src/lib/MongoStore';
dotenv.config();
const express = require("express");
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
//for css
const path = require("path");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

// creates connection to mongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

//-----------------------------------------------------

//Middleware
app.use(express.urlencoded({extended: false})) // parsing the form data
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 7 * 24 * 60 * 60 // 1 week in seconds
      }),
      cookie:{
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
        httpOnly: true,
        secure: false,
      }
    })
);

app.use(passUserToView);
//-----------------------------------------------------


// Controllers
const pagesCtrl = require('./controllers/pages');
const authCtrl = require('./controllers/auth');
const exp = require("constants");
const vipCtrl = require('./controllers/vip');


//-----------------------------------------------------

// GET /
app.get("/", pagesCtrl.home);

app.get("/auth/sign-up", authCtrl.signUp);

// send form request
app.post("/auth/sign-up", authCtrl.addUser);

app.get("/auth/sign-in", authCtrl.signInForm);

app.post("/auth/sign-in", authCtrl.signIn);

app.get('/auth/sign-out', authCtrl.signOut);

app.get("/vip-lounge", isSignedIn, vipCtrl.welcome);

//-----------------------------------------------------
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});

