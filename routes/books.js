// 'use strict';
const express = require('express');
const router = express.Router();
const knex = require('../knex')
const humps =  require('humps')

// const isParamValid = (req, res, next) => {
//     knex('books')
//     .then(result => {
//       if(!result.includes(req.params.id)){
//         res.type('text/plain')
//         res.status(404).send('Not Found')
//       } else {
//         next()
//       }
//     })
// }

const isReqBodyValid = (req, res, next) => {
  const { title, author, genre, description, coverUrl } = req.body
  if (title === undefined){
    res.type('text/plain')
    res.status(400).send('Title must not be blank')
  } else if (author === undefined){
    res.type('text/plain')
    res.status(400).send('Author must not be blank')
  } else if (genre === undefined){
    res.type('text/plain')
    res.status(400).send('Genre must not be blank')
  } else if (description === undefined){
    res.type('text/plain')
    res.status(400).send('Description must not be blank')
  } else if (coverUrl === undefined){
    res.type('text/plain')
    res.status(400).send('Cover URL must not be blank')
  } else {
      next()
  }
}


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



router.get('/', getAllBooks)
router.get('/:id', getBookById)
router.post('/', isReqBodyValid, postNewBook)
router.patch('/:id', updateBookById)
router.delete('/:id', deleteBookById)


module.exports = router;
