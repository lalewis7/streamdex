var express = require('express');
var router = express.Router();
var userModel = require('../models/user.js');

// get all users (need special priv)
router.get('/', (req, res) => {
  
});

// create user
router.post('/', (req, res) => {
  var handle = req.body.handle;
  var email = req.body.email;
  var pass = req.body.password;

  userModel.createUser({handle: handle, email: email, password: pass})
  .then(() => {
    res.sendStatus(201);
  })
  .catch(err => {
    res.sendStatus(400);
  });
});

// dne
router.put('/', (req, res) => {

})

// dne
router.delete('', (req, res) => {
  
})

// get user
router.get('/:userId', (req, res) => {

})

// edit user
router.put('/:userId', (req, res) => {

});

module.exports = router;
