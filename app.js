const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const { ensureAuthenticated } = require('./helpers/auth');

const app = express();


//How middleware works.
// app.use(function(req, res, next) {
//     console.log(Date.now());
//     next();
// });

/**************************** Configuration ****************************/
//passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/database');

/**************************** End Configuration ************************/

//Map global promise - get rid of warning.
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect(db.mongoURI, {
    useMongoClient: true
})
.then(() => { console.log('mongoDB connected'); })
.catch(err => console.log(err));

/**************************************** Midllewares ******************************/
//Hanldebars middleware.
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set static folder for express.
app.use(express.static(path.join(__dirname, 'public')));

//method-override middleware
app.use(methodOverride('_method'));

//Express-session middleware
app.use(session({
    secret: 'anything you want',
    resave: true,
    saveUninitialized: true
}));

//passport middlewares. Must come after above mentioned session middleware.
app.use(passport.initialize());
app.use(passport.session());

//connect-flash middleware
app.use(flash());

//global variables for application.
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
    // console.log('after');
});

/************************************* End Midllewares ******************************/

/************************************* Static pages *********************************/
//Index request GET
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//about request GET
app.get('/about', (req, res) => {
    res.render('about');
});

/********************************* End Static pages *********************************/

/**************************** Load Routes **************************/
//ideas routes.
const ideas = require('./routes/ideas');

//user routes.
const users = require('./routes/users');
/**************************** End Load Routes **************************/

/**************************** Using routes *********************************/
//using idea routes
app.use('/ideas', ensureAuthenticated, ideas)

//using user routes
app.use('/users', users);

/**************************** End Using routes *********************************/

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
