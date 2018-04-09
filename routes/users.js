'use strict';
const express = require('express');
const knex = require('../knex')
const humps =  require('humps')
const router = express.Router();
const bcrypt = require('bcrypt')
const KEY = process.env.JWT_KEY
const jwt = require('jsonwebtoken')


const isEmailValid = (req, res, next) => {
  knex('users')
    .select('email')
    .then(emailsInDB => {
      const allEmails = emailsInDB.map(x => x.email)
    if(req.body.email === undefined){
      res.type('text/plain')
      res.status(400).send('Email must not be blank')
    } else if (allEmails.includes(req.body.email)) {
      res.type('text/plain')
      res.status(400).send('Email already exists')
    } else {
      next()
    }
  })
}

const isPasswordValid = (req, res, next) => {
    if(req.body.password === undefined){
      res.type('text/plain')
      res.status(400).send('Password must be at least 8 characters long')
    } else {
      next()
    }
}

// YOUR CODE HERE
router.post('/', isEmailValid, isPasswordValid, (req, res, next) => {
  const token = jwt.sign(req.body.email, KEY);
  bcrypt.genSalt(8, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hashed) => {
      knex('users')
      .insert({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        hashed_password: hashed
      })
      .returning(['first_name', 'last_name', 'email', 'id'])
      .then(result => {
        res.cookie("token", token, {
            Path: '/',
            httpOnly: true
          })
        .status(200).json(humps.camelizeKeys(result[0]))
      })
    })
  })
})

module.exports = router;
