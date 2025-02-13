const express = require('express');
const { registerController, loginController } = require('../controllers/authController');  
 const router = express.Router();

router.post('/signup', registerController);
router.post('/signin', loginController);  
module.exports = router
