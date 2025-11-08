const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getUserByName,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all users (with pagination)
router.get('/', getAllUsers);

// @route   GET /api/users/name/:name
// @desc    Get user by name
router.get('/name/:name', getUserByName);

// @route   GET /api/users/:id
// @desc    Get single user by ID
router.get('/:id', getUserById);

// @route   POST /api/users
// @desc    Create new user
router.post('/', createUser);

// @route   PUT /api/users/:id
// @desc    Update user
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
router.delete('/:id', deleteUser);

module.exports = router;
