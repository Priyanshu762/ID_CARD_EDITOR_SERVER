const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userData: { 
    type: Map, 
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  templateId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: [true, 'Template ID is required']
  },
  templateName: {
    type: String,
    trim: true
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
  timestamps: true,
  strict: false // Allow flexible schema for dynamic userData
});

// Index for faster queries
userSchema.index({ templateId: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'userData.name': 1 });
userSchema.index({ 'userData.employeeId': 1 });

// Method to get user with populated template
userSchema.methods.getWithTemplate = async function() {
  await this.populate('templateId');
  return this;
};

// Virtual for user name (if it exists in userData)
userSchema.virtual('displayName').get(function() {
  if (this.userData && this.userData.get('name')) {
    return this.userData.get('name');
  }
  return 'Unknown User';
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
