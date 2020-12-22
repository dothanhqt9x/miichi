var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController')
var auth = require('../middleware/auth')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
module.exports = router;
