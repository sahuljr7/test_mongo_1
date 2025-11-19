const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Incident type is required'],
    trim: true
  },
  incidentStartDate: {
    type: Date,
    required: [true, 'Incident start date is required']
  },
  incidentEndDate: {
    type: Date,
    validate: {
      validator: function(value) {
        // End date should be after start date if both are provided
        return !value || value >= this.incidentStartDate;
      },
      message: 'Incident end date must be after start date'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description should be at least 10 characters long']
  },
  remarks: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'closed'],
      message: 'Status must be either "open" or "closed"'
    },
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
incidentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find open incidents
incidentSchema.statics.findOpenIncidents = function() {
  return this.find({ status: 'open' });
};

// Instance method to close incident
incidentSchema.methods.closeIncident = function() {
  this.status = 'closed';
  this.incidentEndDate = new Date();
  return this.save();
};

// Virtual for incident duration (in days)
incidentSchema.virtual('durationInDays').get(function() {
  if (!this.incidentStartDate) return 0;
  const endDate = this.incidentEndDate || new Date();
  const diffTime = Math.abs(endDate - this.incidentStartDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Ensure virtual fields are serialized
incidentSchema.set('toJSON', { virtuals: true });

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;