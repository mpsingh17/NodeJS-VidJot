const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();


//How middleware works.
// app.use(function(req, res, next) {
//     console.log(Date.now());
//     next();
// });

//Map global promise - get rid of warning.
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useMongoClient: true
})
.then(() => { console.log('mongoDB connected'); })
.catch(err => console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

/************** Midllewares **************/

//Hanldebars middleware.
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//method-override middleware
app.use(methodOverride('_method'));

//Express-session middleware
app.use(session({
    secret: 'anything you want',
    resave: true,
    saveUninitialized: true
}));

//connect-flash middleware
app.use(flash());

//global variables for messages. Middleware!!
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

/************** End Midllewares **************/

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

//list of ideas GET.
app.get('/ideas', (req, res) => {
    Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });
    });
});

//Add idea form GET
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Edit idea form GET
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea: idea
        });
    });
});

//Process form data for ideas.
app.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({text: 'Please provide title.'});
    }

    if (!req.body.details) {
        errors.push({ text: 'Please provide details for your idea.' });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newIdea)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video idea added');
                res.redirect('/ideas');
            });
    }
});

//Process Edit form PUT.
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Video idea updated');
            res.redirect('/ideas');
        });
    });
});

//Delete idea DELETE
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Video idea deleted');
        res.redirect('/ideas');
    });
});

const port = 5000;
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});