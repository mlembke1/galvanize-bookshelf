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

const getAllFavs = (req, res, next) => {
  const token = req.cookies.token
  const email = jwt.decode(token)
  knex('users')
  .then(allUsers => {
    const loggedInUserId = allUsers.filter(user => user.email === email)[0].id
    return knex('favorites')
      .join('users', 'favorites.user_id', loggedInUserId)
      .join('books', 'books.id', 'favorites.book_id')
      .then(result => {
        res.status(200).json(humps.camelizeKeys(result))
      })
  })
}

const checkForBookInDB = (req, res, next) => {
  return knex('favorites')
    .where('book_id', req.query.bookId)
    .then(result => {
      if (result.length > 0) {
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
            .where('id', req.body.bookId)
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
    return knex('favorites')
      .where('book_id', req.body.bookId)
      .del()
      .then(result => {
        res.status(200).json({
          result
        })
      })
}


router.get('/', hasToken, getAllFavs)
router.get('/check', hasToken, checkForBookInDB)
router.post('/',  hasToken, postToFavs)
router.delete('/', hasToken, deleteFromFavs)


module.exports = router;
