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
// const vipCtrl = require('./controllers/vip');
const applicationsCtrl = require('./controllers/applications');


//-----------------------------------------------------

// GET /
app.get("/", pagesCtrl.home);

app.get("/auth/sign-up", authCtrl.signUp);

// send form request
app.post("/auth/sign-up", authCtrl.addUser);

app.get("/auth/sign-in", authCtrl.signInForm);

app.post("/auth/sign-in", authCtrl.signIn);

app.get('/auth/sign-out', authCtrl.signOut);

// app.get("/vip-lounge", isSignedIn, vipCtrl.welcome);

app.use(isSignedIn); //anything under here, the user must be signed in

//userId: 67a1c075761606394519e9a9
app.get('/users/:userId/applications/new', applicationsCtrl.newApplication); // view new applicationn form

app.post("/users/:userId/applications", applicationsCtrl.createApplication); // posting a new application

app.get('/users/:userId/applications', applicationsCtrl.index); // show or view all the applications

app.get('/users/:userId/applications/:applicationId', applicationsCtrl.show ) // show detail of one application



//-----------------------------------------------------
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});

