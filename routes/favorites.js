'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex')
const humps= require('humps')
const jwt = require('jsonwebtoken')


const getAll = (req, res, next) => {
    knex('favorites')
    .join('books', 'books.id', 'favorites.book_id')
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result))
    })
}

 const checkForBookInDB = (req, res, next) => {
   return knex('favorites')
   .join('books', 'books.id', 'favorites.book_id')
   .then(result => {
     if(req.query.bookId == result[0].book_id){
        res.status(200).json( true )
     } else {
       res.status(200).json( false )
     }
   })
 }

 const postToFavs = (req, res, next) => {
   const token = req.cookies.token
   const decoded = jwt.decode(token)
   knex('favorites')
   .join('users', 'users.id', 'favorites.user_id')
   .then(result => {
     knex('favorites')
     .insert({
       book_id: req.body.bookId,
       'user_id': result[0].user_id
     })
     .returning(['id', 'book_id', 'user_id'])
     .then(result => {
       res.status(200).json(humps.camelizeKeys(result[0]))
     })
   })
 }

router.get('/', getAll)
router.get('/check', checkForBookInDB)
router.post('/', postToFavs)


module.exports = router;
