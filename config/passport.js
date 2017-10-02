const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load user model
require('../models/User');
const User = mongoose.model('users');

module.exports = function(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({
            email: email
        })
        .then((user) => {
            // check if user exist
            if(!user) {
                return done(null, false, {message: 'No user found with this email'});
            }

            //compare passwords
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'password incorrect!' });
                }
            });
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}