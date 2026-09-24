import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['donor', 'shelter', 'volunteer', 'guest', 'admin'],
      default: 'guest',
      required: true,
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    organizationType: {
      type: String,
      enum: ['Restaurant', 'Bakery', 'Supermarket', 'Cafeteria', 'Shelter', 'FoodBank', 'Individual', 'Other'],
      default: 'Restaurant',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    location: {
      address: {
        type: String,
        default: '123, Green Park, Sector 12, New Delhi - 110016',
      },
      coordinates: {
        lat: { type: Number, default: 28.5582 },
        lng: { type: Number, default: 77.2023 },
      },
    },
    // Specific metadata for Shelters
    shelterDetails: {
      capacityKg: {
        type: Number,
        default: 50,
      },
      currentStorageUsedKg: {
        type: Number,
        default: 35,
      },
      foodPreferences: {
        type: [String],
        default: ['Veg Only', 'Cooked Meals Accepted'],
      },
      contactPerson: {
        type: String,
        default: 'Shelter Coordinator',
      },
    },
    // Specific metadata for Volunteers
    volunteerDetails: {
      vehicleType: {
        type: String,
        default: 'Scooter / Mini Van',
      },
      completedRescuesCount: {
        type: Number,
        default: 12,
      },
      totalKgDelivered: {
        type: Number,
        default: 186,
      },
      communitiesServed: {
        type: Number,
        default: 8,
      },
      certificatesEarned: {
        type: Number,
        default: 3,
      },
      isAvailableNow: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.password === enteredPassword) return true;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
