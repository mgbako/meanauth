const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User  = require('../models/user');

//Signup
router.post('/signup', (req, res) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      return res.json({success: false, msg:'Failed to register user'});
    }

    return res.json({success: true, msg: 'User registered'});
  })
});

//Signin
router.post('/signin', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw new Error(err);
    if(!user){
      return res.json({success:false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw new Error(err)
      if(isMatch){
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800 // 1 Week
        });

        res.json({
          success: true,
          token: 'Bearer '+ token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong Password'});
      }
    })
  })
});


//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});



module.exports = router;