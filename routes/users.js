'use strict';
const express = require('express');
const knex = require('../knex')
const humps =  require('humps')
const router = express.Router();
const bcrypt = require('bcrypt')

// YOUR CODE HERE
router.post('/', (req, res, next) => {
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
        res.status(200).json(humps.camelizeKeys(result[0]))
      })
    })
  })
})

module.exports = router;
