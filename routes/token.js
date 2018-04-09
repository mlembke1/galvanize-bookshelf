'use strict';
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const humps = require('humps')
const knex = require('../knex')
const KEY = process.env.JWT_KEY
const bcrypt = require('bcrypt')


// YOUR CODE HERE
router.get('/', (req, res, next) => {
  if (!req.cookies.token) {
    res.json(false)
  } else {
    res.json(true)
  }
})

const isEmailOrPassUndefined = (req, res, next) => {
  if(req.body.email === undefined){
    res.type('text/plain')
    res.status(400).send('Email must not be blank')
  } else if (req.body.password === undefined) {
    res.type('text/plain')
    res.status(400).send('Password must not be blank')
  } else {
    next()
  }
}

// FUNCTION TO VERIFY THAT THE EMAIL IS CORRECT
const emailPasses = (req, res, next) => {
  return knex('users')
    .select('email')
    .where('email', req.body.email)
    .then(result => {
      if (result[0] === undefined) {
        res.status(400)
        res.type('text/plain')
        .send('Bad email or password')
      } else {
        next()
      }
    })
}

// FUNCTION TO VERIFY THAT THE PASSWORD IS CORRECT
const passwordPasses = (req, res, next) => {
  return knex('users')
    .select('hashed_password', 'email')
    .where('email', req.body.email)
    .then(result => {
      const storedHashedPassword = result[0].hashed_password
      bcrypt.compare(req.body.password, storedHashedPassword).then(res => {
        return res
      }).then(result => {
        const passwordsMatch = result
        if(passwordsMatch === false){
          res.status(400)
          res.type('text/plain')
          .send('Bad email or password')
        } else {
          next()
        }
      })
    })
}


// POST REQUEST
router.post('/', isEmailOrPassUndefined, emailPasses, passwordPasses, (req, res, next) => {
  const {
    email,
    password
  } = req.body

  // IF THE EMAIL AND PASSWORD MATCH WHAT IS IN THE DATABSE...
  // THEN CHECK IF THE USER HAS A JWT YET. IF NOT, GIVE THEM ONE.
    if (!req.cookies.token) {
      const token = jwt.sign(email, KEY);
      knex('users')
        .select('id', 'email', 'first_name', 'last_name')
        .where('email', req.body.email)
        .then(result => {
          res.cookie("token", token, {
              Path: '/',
              httpOnly: true
            })
            .status(200)
            .json(humps.camelizeKeys(result[0]))
        })
    }
    // IF THE USER DOES HAVE A JWT KEY, MAKE SURE THAT IT HAS NOT BEEN TAMPERED WITH
    else {
      jwt.verify(token, KEY, (err, decoded) => {
        if (err) {
          res.redirect('/')
        }
      })
    }
})


// DELETE REQUEST
router.delete('/', (req, res, next) => {
  res.cookie("token", '', {
      Path: '/',
      httpOnly: true
    })
    .status(200)
    .send(true)
})


module.exports = router;
