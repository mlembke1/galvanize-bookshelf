// 'use strict';
const express = require('express');
const router = express.Router();
// const bodyParser = require('body-parser')
const morgan = require('morgan')
const knex = require('../knex')
const humps =  require('humps')

// YOUR CODE HERE
// router.use(bodyParser.json())

let lastId  

router.get('/books', (req, res) => {
  knex('books')
  .orderBy('title', 'asc')
  .then(book => {
    lastId = book[book.length-1].id
    res.json(humps.camelizeKeys(book))
  })
})

router.get('/books/:id', (req, res) => {
  const { id } = req.params
  knex('books')
  .where('id', id)
  .then(book => {
    res.json(humps.camelizeKeys(book)[0])
  })
})

router.post('/books', (req, res) => {
    req.body['id'] = lastId + 1
    res.status(200).json(humps.camelizeKeys(req.body))
  })


router.patch('/books/:id', (req, res) => {
  const { id } = req.params
  req.body['id'] = id
  res.status(200).json(req.body)
})

router.delete('/books/:id', (req, res) => {
  const { id } = req.params
  knex('books')
  .select('title', 'author', 'genre', 'description', 'cover_url')
  .where('id', id)
  .then(book => {
    res.status(200).json(humps.camelizeKeys(book)[0])
  })
})

module.exports = router;
