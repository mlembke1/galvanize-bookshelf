'use strict';
const boom = require('boom')
const express = require('express');
const router = express.Router();
const knex = require('../knex')
const humps = require('humps')
const jwt = require('jsonwebtoken')

const hasToken = (req, res, next) => {
  if(req.cookies.token === undefined) {
    res.type('plain/text')
    res.status(401).send('Unauthorized')
  } else {
    next()
  }
}

// const doesBookExistInBooks = (req, res, next) => {
//   knex('books')
//     .select('id')
//     .then(bookIds => {
//         const allIDsInBooks = bookIds.map(bookId => bookId.id)
//         console.log(allIDsInBooks)
//         if(!allIDsInBooks.includes(req.query.bookId)){
//           res.type('plain/text')
//           res.status(404).send('Book not found')
//         } else {
//           next()
//         }
//     })
// }

// const doesBookExistInFavs = (req, res, next) => {
//   knex('favorites')
//     .select('book_id')
//     .then(bookIdsInFavs => {
//         const allIdsInFavs = bookIdsInFavs.map(bookId => bookIdsInFavs.id)
//         if(!allIdsInFavs.includes(req.query.bookId)){
//           res.type('plain/text')
//           res.status(404).send('Favorite not found')
//         } else {
//           next()
//         }
//     })
// }


// const isBookIDInteger = (req, res, next) => {
//   if( req.query.bookId === undefined || typeof req.query.bookId != 'number'){
//     res.type('text/plain')
//     res.status(400).send('Book ID must be an integer')
//   } else {
//     next()
//   }
// }

const getAllFavs = (req, res, next) => {
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
      if (req.query.bookId == result[0].book_id) {
        res.status(200).json(true)
      } else {
        res.status(200).json(false)
      }
    })
}

const postToFavs = (req, res, next) => {
  const token = req.cookies.token
  const email = jwt.decode(token)
  knex('users')
    .then(allUsers => {
      const loggedInUser = allUsers.filter(user => user.email === email)
      knex('favorites')
        .insert({
          book_id: req.body.bookId,
          user_id: loggedInUser[0].id
        })
        .returning(['id', 'book_id', 'user_id'])
        .then(result => {
          res.status(200).json(humps.camelizeKeys(result[0]))
        })
    })
}

const deleteFromFavs = (req, res, next) => {
  const token = req.cookies.token
  const email = jwt.decode(token)
  knex('users')
    .then(allUsers => {
      const loggedInUser = allUsers.filter(user => user.email === email)
      knex('favorites')
        .where('book_id', req.body.bookId)
        .del()
          res.status(200).json({
            userId: loggedInUser[0].id,
            bookId: req.body.bookId
          })
        })
}

router.get('/', hasToken, getAllFavs)
router.get('/check', hasToken, checkForBookInDB)
router.post('/',  hasToken, postToFavs)
router.delete('/',  hasToken, deleteFromFavs)


module.exports = router;
