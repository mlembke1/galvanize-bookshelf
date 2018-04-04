// 'use strict';
const express = require('express');
const router = express.Router();
const knex = require('../knex')
const humps =  require('humps')


router.get('/', (req, res) => {
  knex('books')
  .orderBy('title', 'asc')
  .then(book => {
    res.json(humps.camelizeKeys(book))
  })
})

router.get('/:id', (req, res) => {
  const { id } = req.params
  knex('books')
  .where('id', id)
  .then(book => {
    res.json(humps.camelizeKeys(book)[0])
  })
})

router.post('/', (req, res) => {
    knex('books')
    .insert({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl
    })
    .returning('*')
    .then(data => {
      res.json(humps.camelizeKeys(data[0]))
    })
  })


router.patch('/:id', (req, res, next) => {
   knex('books')
   .where('id', req.params.id)
   .limit(1)
   .update(humps.decamelizeKeys({
     title: req.body.title,
     author: req.body.author,
     genre: req.body.genre,
     description: req.body.description,
     coverUrl: req.body.coverUrl
   }))
     .returning('*')
     .then((result) => {
       res.json(humps.camelizeKeys(result[0]))
     })
  })


router.delete('/:id', (req, res) => {
  const { id } = req.params
  knex('books')
  .where('id', id)
  .first()
  .then(book => {
    knex('books')
    .del()
    .where('id', id)
    .then(() => {
      res.json({
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        coverUrl: book.cover_url
      })
    })
    .catch(err => next(err))
  })
})

module.exports = router;
