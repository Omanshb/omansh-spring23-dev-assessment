import mongoose from 'mongoose'

export const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address.'],
  },
  password: {
    type: String,
    // Validation is in api/user route
  },
  profilePicture: {
    type: String,
    match: [/^https?:\/\//, 'Invalid URL for profile picture. It must start with "http" or "https".'],
  }
});

export const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Animal name is required.'],
    trim: true,
  },
  hoursTrained: {
    type: Number,
    required: [true, 'Hours trained is required.'],
    min: [0, 'Hours trained cannot be negative.'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Owner ID is required.'],
    ref: 'User',
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required.'],
    validate: {
      validator: function (v) {
        return v <= Date.now();
      },
      message: props => 'Date of birth cannot be in the future!',
    },
  },
  profilePicture: {
    type: String,
    match: [/^https?:\/\//, 'Invalid URL for profile picture. It must start with "http" or "https".'],
  },
});

export const trainingLogSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date of training log is required.'],
    validate: {
      validator: function (v) {
        return v <= Date.now();
      },
      message: props => 'Training log date cannot be in the future!',
    },
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
    trim: true,
  },
  hours: {
    type: Number,
    required: [true, 'Number of hours is required.'],
    min: [0, 'Number of hours cannot be negative.'],
  },
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Animal ID is required.'],
    ref: 'Animal',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required.'],
    ref: 'User',
  },
  trainingLogVideo: {
    type: String,
    match: [/^https?:\/\//, 'Invalid URL for training log video. It must start with "http" or "https".'],
  },
});

export const User = mongoose.model('User', userSchema);
export const Animal = mongoose.model('Animal', animalSchema);
export const TrainingLog = mongoose.model('TrainingLog', trainingLogSchema);