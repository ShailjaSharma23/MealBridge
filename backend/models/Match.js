import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    jobCode: {
      type: String,
      unique: true,
      default: function () {
        return `JOB-${Math.floor(100 + Math.random() * 900)}`;
      },
    },
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      required: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: [
        'offered',
        'accepted',
        'passed',
        'volunteer_assigned',
        'in_transit',
        'delivered',
        'expired',
        're_dispatch_needed',
        'relay_needed',
      ],
      default: 'offered',
    },
    breakdownIncident: {
      reported: { type: Boolean, default: false },
      stage: { type: String, enum: ['before_pickup', 'in_transit'], default: null },
      reason: { type: String, default: '' },
      reportedAt: { type: Date, default: null },
      location: {
        lat: Number,
        lng: Number,
        address: String,
      },
      notes: { type: String, default: '' },
      originalVolunteerName: { type: String, default: '' },
    },
    distanceKm: {
      type: Number,
      required: true,
      default: 1.8,
    },
    pickupLocation: {
      name: { type: String, default: 'Bistro 42' },
      address: { type: String, default: '123, Green Park, Sector 12, New Delhi' },
      lat: { type: Number, default: 28.5582 },
      lng: { type: Number, default: 77.2023 },
    },
    dropoffLocation: {
      name: { type: String, default: 'Hope Shelter' },
      address: { type: String, default: 'Community Hall 4, Lajpat Nagar, New Delhi' },
      lat: { type: Number, default: 28.5677 },
      lng: { type: Number, default: 77.2433 },
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
    cascadeAttempt: {
      type: Number,
      default: 1,
    },
    passedShelters: [
      {
        shelter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        shelterName: String,
        passedAt: { type: Date, default: Date.now },
        reason: { type: String, default: 'Capacity full or diet mismatch' },
      },
    ],
    offerExpiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 15 * 60 * 1000); // 15-minute cascade window
      },
    },
  },
  {
    timestamps: true,
  }
);

const Match = mongoose.model('Match', matchSchema);

export default Match;
