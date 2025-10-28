import mongoose, { Schema } from 'mongoose';
import { IBeer } from '../types';

const beerSchema = new Schema<IBeer>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  brewery: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  style: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  abv: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  drank: {
    type: Boolean,
    default: false
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  dateDrank: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Add indexes for better performance
beerSchema.index({ name: 1, brewery: 1 });
beerSchema.index({ style: 1 });
beerSchema.index({ drank: 1 });
beerSchema.index({ dateAdded: -1 });

export const Beer = mongoose.model<IBeer>('Beer', beerSchema);
