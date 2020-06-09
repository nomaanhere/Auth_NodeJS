const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
//passport config
require('./config/passport')(passport);
//DB config
const db = require('./config/keys').MongoURI;
//connect to Mongo
mongoose.connect(db, { useNewUrlParser : true })
.then(() => console.log('MongoDB connected!') )
.catch(err => console.log(err));
//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
//BodyParser 
app.use(express.urlencoded({ extended: false }));
//Express session 
app.use(session({
    secret: 'secret',
    resave:true,
    saveUninitialized :true
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());  

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started on ${PORT}`));