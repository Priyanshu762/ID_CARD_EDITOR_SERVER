const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Template name is required'],
    trim: true
  },
  thumbnail: { 
    type: String,
    default: null
  },
  templateData: {
    canvas: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      backgroundColor: { type: String, default: '#ffffff' },
      backgroundOpacity: { type: Number, default: 1, min: 0, max: 1 },
      backgroundImage: { type: String, default: null },
      // Canvas border properties
      borderStyle: { type: String, enum: ['none', 'one', 'two', 'all'], default: 'none' },
      borderWidth: { type: Number, default: 1 },
      borderColor: { type: String, default: '#000000' },
      borderSides: { type: String, default: '' }
    },
    elements: [{
      id: String,
      type: { type: String, enum: ['text', 'image', 'qr'], required: true },
      x: Number,
      y: Number,
      zIndex: Number,
      // Text-specific fields
      value: String,
      label: String,
      fontSize: Number,
      fontFamily: String,
      fontWeight: String,
      color: String,
      align: String,
      // Image-specific fields
      src: String,
      width: Number,
      height: Number,
      borderRadius: Number,
      // QR-specific fields
      data: String,
      size: Number,
      // Border properties (applicable to all element types)
      borderStyle: { type: String, enum: ['none', 'one', 'two', 'all'], default: 'none' },
      borderWidth: { type: Number, default: 1 },
      borderColor: { type: String, default: '#000000' },
      borderSides: { type: String, default: '' } // For one side: 'left'/'right'/'top'/'bottom', For two sides: 'vertical'/'horizontal'
    }]
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Index for faster queries
templateSchema.index({ name: 1 });
templateSchema.index({ createdAt: -1 });

// Method to get template summary (without full templateData)
templateSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    name: this.name,
    thumbnail: this.thumbnail,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
