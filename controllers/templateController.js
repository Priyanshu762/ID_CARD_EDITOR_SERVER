const Template = require('../models/Template');

/**
 * @desc    Get all templates (summary view without full templateData)
 * @route   GET /api/templates
 * @access  Public
 */
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find()
      .select('name thumbnail createdAt updatedAt')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    console.error('Error in getAllTemplates:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * @desc    Get single template by ID (with full templateData)
 * @route   GET /api/templates/:id
 * @access  Public
 */
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error in getTemplateById:', error);
    
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
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
 * @desc    Get template by name
 * @route   GET /api/templates/name/:name
 * @access  Public
 */
exports.getTemplateByName = async (req, res) => {
  try {
    const template = await Template.findOne({ 
      name: { $regex: new RegExp(req.params.name, 'i') } 
    });
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error in getTemplateByName:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * @desc    Create new template
 * @route   POST /api/templates
 * @access  Public
 */
exports.createTemplate = async (req, res) => {
  try {
    const { name, thumbnail, templateData } = req.body;
    
    // Validation
    if (!name || !templateData) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name and templateData'
      });
    }
    
    // Check if template with same name exists
    const existingTemplate = await Template.findOne({ name });
    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        error: 'Template with this name already exists'
      });
    }
    
    const template = await Template.create({
      name,
      thumbnail,
      templateData
    });
    
    res.status(201).json({
      success: true,
      data: template,
      message: 'Template created successfully'
    });
  } catch (error) {
    console.error('Error in createTemplate:', error);
    
    // Handle validation errors
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
 * @desc    Update or create template (upsert by name)
 * @route   PUT /api/templates
 * @access  Public
 */
exports.updateTemplate = async (req, res) => {
  try {
    const { name, ...updateData } = req.body;
    
    console.log('=== updateTemplate ===');
    console.log('Template name:', name);
    console.log('Update data:', JSON.stringify(updateData, null, 2));
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Template name is required'
      });
    }
    
    // Find template by name and update, or create if not exists
    const template = await Template.findOneAndUpdate(
      { name: name }, // Find by name
      { name, ...updateData }, // Update data
      {
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        runValidators: true // Run schema validators
      }
    );
    
    console.log('Saved template canvas:', JSON.stringify(template.templateData.canvas, null, 2));
    
    res.status(200).json({
      success: true,
      data: template,
      message: 'Template saved successfully'
    });
  } catch (error) {
    console.error('Error in updateTemplate:', error);
    
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
 * @desc    Delete template
 * @route   DELETE /api/templates/:id
 * @access  Public
 */
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }
    
    await template.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {},
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteTemplate:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};
