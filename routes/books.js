// 'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const morgan = require('morgan')
const knex = require('../knex')
const humps =  require('humps')

// YOUR CODE HERE
router.use(bodyParser.json())

router.get('/books', (req, res) => {
  knex('books')
  .orderBy('title', 'asc')
  .then(book => {

    res.json(humps.camelizeKeys(book))
  })
})

module.exports = router;
