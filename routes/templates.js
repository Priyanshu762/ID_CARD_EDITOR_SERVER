const express = require('express');
const router = express.Router();
const {
  getAllTemplates,
  getTemplateById,
  getTemplateByName,
  createTemplate,
  updateTemplate,
  deleteTemplate
} = require('../controllers/templateController');

// @route   GET /api/templates
// @desc    Get all templates (summary)
router.get('/', getAllTemplates);

// @route   GET /api/templates/name/:name
// @desc    Get template by name
router.get('/name/:name', getTemplateByName);

// @route   GET /api/templates/:id
// @desc    Get single template by ID
router.get('/:id', getTemplateById);

// @route   POST /api/templates
// @desc    Create new template
router.post('/', createTemplate);

// @route   PUT /api/templates
// @desc    Update or create template (upsert by name)
router.put('/', updateTemplate);

// @route   PUT /api/templates/:id
// @desc    Update template by ID (legacy support)
router.put('/:id', updateTemplate);

// @route   DELETE /api/templates/:id
// @desc    Delete template
router.delete('/:id', deleteTemplate);

module.exports = router;
