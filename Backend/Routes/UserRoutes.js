const express = require('express');
const { CreateUser, LoginUser, GetAllUsers } = require('../Controller/UserController');

const router = express.Router();

// Create account endpoint
router.post('/create', CreateUser);

// Signup endpoint
router.post('/signup', CreateUser);

// Login endpoint
router.post('/login', LoginUser);

// Get all users (for admin or debugging)
router.get('/', GetAllUsers);

module.exports = router;