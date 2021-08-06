var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  return res.sendStatus(405);
});

router.post('/', (req, res) => {
  return res.sendStatus(405);
});

router.put('/', (req, res) => {
  return res.sendStatus(405);
});

router.delete('/', (req, res) => {
  return res.sendStatus(405);
});

module.exports = router;
