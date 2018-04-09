// 'use strict';
const express = require('express');
const router = express.Router();
const knex = require('../knex')
const humps =  require('humps')



router.get('/', getAllBooks)
router.get('/:id', getBookById)
router.post('/', postNewBook)
router.patch('/:id', updateBookById)
router.delete('/:id', deleteBookById)



const getAllBooks = (req, res) => {
  knex('books')
  .orderBy('title', 'asc')
  .then(book => {
    res.json(humps.camelizeKeys(book))
  })
}

const getBookById = (req, res) => {
  const { id } = req.params
  knex('books')
  .where('id', id)
  .then(book => {
    res.json(humps.camelizeKeys(book)[0])
  })
}


const postNewBook = (req, res) => {
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
}


const updateBookById = (req, res, next) => {
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
}


const deleteBookById = (req, res) => {
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
}
module.exports = router;
