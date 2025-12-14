const express = require('express');
const authController = require('../controllers/auth.controller');
const { authUserMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

//user auth APIs
router.post('/user/register', authController.registerUser); 
router.post('/user/login', authController.loginUser);
router.post('/user/logout', authController.logoutUser);
router.get('/user/me', authUserMiddleware, authController.getUserProfile);


//food partner auth APIs
router.post('/food-partner/register', authController.registerFoodPartner);
router.post('/food-partner/login', authController.loginFoodPartner);
router.post('/food-partner/logout', authController.logoutFoodPartner);





module.exports = router;