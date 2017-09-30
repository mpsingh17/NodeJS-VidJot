const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');


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

//Hanldebars middleware.
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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

const port = 5000;
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});