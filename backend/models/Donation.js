import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    donorName: {
      type: String,
      required: true,
      default: 'Bistro 42',
    },
    foodName: {
      type: String,
      required: [true, 'Please specify the food name'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Cooked Meals', 'Bakery', 'Produce', 'Packaged Food', 'Beverages', 'Other'],
      default: 'Cooked Meals',
      required: true,
    },
    quantityKg: {
      type: Number,
      required: [true, 'Please specify quantity in kg'],
      min: [0.5, 'Minimum donation is 0.5 kg'],
    },
    servingsCount: {
      type: Number,
      default: function () {
        return Math.round(this.quantityKg * 2.5); // Approx 2.5 meals per kg
      },
    },
    dietaryType: {
      type: String,
      enum: ['Veg Only', 'Non-Veg', 'Vegan', 'Jain Friendly'],
      default: 'Veg Only',
    },
    expiryHours: {
      type: Number,
      required: true,
      default: 3,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    pickupAddress: {
      type: String,
      required: [true, 'Please provide pickup address'],
      default: '123, Green Park, Sector 12, New Delhi - 110016',
    },
    pickupCoordinates: {
      lat: { type: Number, default: 28.5582 },
      lng: { type: Number, default: 77.2023 },
    },
    photoUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['posted', 'matched', 'volunteer_assigned', 'picked_up', 'delivered', 'expired'],
      default: 'posted',
    },
    assignedShelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    trackingTimestamps: {
      postedAt: { type: Date, default: Date.now },
      matchedAt: { type: Date, default: null },
      volunteerAssignedAt: { type: Date, default: null },
      pickedUpAt: { type: Date, default: null },
      deliveredAt: { type: Date, default: null },
    },
    isUrgent: {
      type: Boolean,
      default: function () {
        return this.expiryHours <= 1.5;
      },
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for calculating remaining hours
donationSchema.virtual('hoursRemaining').get(function () {
  const diffMs = this.expiresAt - new Date();
  return Math.max(0, (diffMs / (1000 * 60 * 60)).toFixed(1));
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
