const User = require('../models/User');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Public
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, templateId } = req.query;
    
    const query = templateId ? { templateId } : {};
    
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('templateId', 'name');
    
    const count = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: users.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: users
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('templateId');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in getUserById:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * @desc    Get user by name (searches in userData)
 * @route   GET /api/users/name/:name
 * @access  Public
 */
exports.getUserByName = async (req, res) => {
  try {
    const searchName = req.params.name;
    
    // Search for name in userData Map
    const users = await User.find({
      $or: [
        { 'userData.name': { $regex: new RegExp(searchName, 'i') } },
        { 'userData.Name': { $regex: new RegExp(searchName, 'i') } },
        { 'userData.Full Name': { $regex: new RegExp(searchName, 'i') } }
      ]
    }).populate('templateId', 'name');
    
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No users found with that name'
      });
    }
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error in getUserByName:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * @desc    Create new user
 * @route   POST /api/users
 * @access  Public
 */
exports.createUser = async (req, res) => {
  try {
    const { userData, templateId, templateName } = req.body;
    
    // Validation
    if (!userData || !templateId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide userData and templateId'
      });
    }
    
    const user = await User.create({
      userData,
      templateId,
      templateName
    });
    
    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error in createUser:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry detected',
        message: 'A user with this information already exists. Please check the employeeId or other unique fields.',
        details: error.keyValue
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Public
 */
exports.updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Public
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {},
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};
