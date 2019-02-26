// local authentication
// For more details go to https://github.com/jaredhanson/passport-local
var LocalStrategy    = require('passport-local').Strategy;


var User       = require('../Model/btw_employee');
var Office       = require('../Model/btw_employee');

// console.log(User);

module.exports = function(passport) {

    // Maintaining persistent login sessions
    // serialized  authenticated user to the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialized when subsequent requests are made
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

     passport.use('login', new LocalStrategy({
        usernameField : 'user_name',
        passReqToCallback : true 
    },
    function(req, user_name, password, done) {
       process.nextTick(function() {
            // console.log(user_name,password);
            User.findOne({ 'Employee_Email' :  user_name })
            .populate({ path: 'Office'}).
            exec(function(err, user) {
                if (err){ return done(err);}
                if (!user)
                  return done(null,false,{status:false,message:'user is not exist'});
                if (!user.verifyPassword(password))
                    return done(null,false,{status:false,message:'Enter correct password'});
               else
                    return done(null, user);
            });
        });

    }));

     passport.use('signup', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true 
    },
    function(req, email, password, done) {

        process.nextTick(function() {
       
            if (!req.user) {
                User.findOne({ 'Employee_Email' :  email }, function(err, user) {
            	    if (err){ return done(err);}
                    if (user) {
                        return done(null, false, req.flash('signuperror', 'User already exists'));
                    } else {
                        var newUser            = new User();
			            newUser.Employee_Name   = req.body.Employee_Name;
                        newUser.user.email       = email;
                        // newUser.user.password = newUser.generateHash(password);
                        newUser.user.password = password;

			            newUser.user.name	= ''
			            newUser.user.address	= ''
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });
            } else {
                var user            = req.user;
		user.user.username    = req.body.username;
                user.user.email    = email;
                user.user.password = user.generateHash(password);
			user.user.name	= ''
			user.user.address	= ''

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }

        });


    }));


};