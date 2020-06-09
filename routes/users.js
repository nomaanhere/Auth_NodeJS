const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
//Login page
router.get('/login', (req,res) => { res.render('login') });
//Register page
router.get('/register', (req,res) => { res.render('register') });
//Register handle 
router.post('/register', (req,res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    //validation
    if(!name || !email || !password || !password){
        errors.push({ msg: 'Please fill all fields'});
    }
    if(password!==password2){
        errors.push({msg:'Passwords do not match'});
    }
    if(password.length<6){
        errors.push({msg:'Password should be atlease 6 characers'});
    }
    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password, 
            password2
        });
    } else {
        User.findOne({ email:email })
        .then(user=> {
            if(user){
                //User Exists
                errors.push({msg:'user already exists'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password, 
                    password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                //Hash Password
                bcrypt.genSalt(10, (err,salt) =>  
                    bcrypt.hash(newUser.password, salt, (err,hash) => {
                        if(err) throw err
                        //set password to hashed
                        newUser.password = hash;
                        //save
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered my darling!');
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err));
                }))

            } 
        })
        .catch(err=>console.log(err));
    }
});

router.post('/login', (req,res,next) => {
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

//Logouts Handler

router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'You successfully logged out');
    res.redirect('/users/login');
})
module.exports = router;